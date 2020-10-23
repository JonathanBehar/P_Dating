const { https } = require("firebase-functions");
const { firestore } = require('firebase-admin');
const { isEmpty } = require('lodash');
const crypto = require('crypto');
const squareConnect = require('square-connect');

exports.chargePaymentFromCard = https.onRequest(async (request, response) => {

    if (isEmpty(request.body)) {
        response.status(400).send("Incorrect Request data");
        return;
    }
    let paymentData;
    try{ paymentData = JSON.parse(request.body) }
    catch(e){ paymentData = request.body ;}

    const cardNonce = paymentData.nonce;
    const price = paymentData.price;
    const userName = paymentData.username;
    const userId = paymentData.user_id;
    const emailAddress = paymentData.email;

    var defaultClient = squareConnect.ApiClient.instance;
    defaultClient.basePath = 'https://connect.squareupsandbox.com';
    var oauth2 = defaultClient.authentications['oauth2'];
    oauth2.accessToken = 'EAAAEPO-HkrUhN5iSFJUCgjpClwVH6PDgDgQtV3vIhrhGTQU9VPraHqtULBccDeF';

    const idempotency_key = crypto.randomBytes(22).toString('hex');
    const customer_idempotency_key = crypto.randomBytes(22).toString('hex');
    const payments_api = new squareConnect.PaymentsApi();
    const customer_api = new squareConnect.CustomersApi();

    
    try {
        const customer = await customer_api.createCustomer({
            idempotency_key : customer_idempotency_key,
            nickname : userName,
            reference_id : userId,
            email_address : emailAddress
        });
        const customer_id = customer.customer.id;
        const card_body = new squareConnect.CreateCustomerCardRequest(cardNonce);
        const card = await customer_api.createCustomerCard(customer_id, card_body);
        const payment_body = {
            source_id: card.card.id,
            amount_money: {
                amount: price, // $1.00 charge ( unit => cent)
                currency: 'USD'
            },
            idempotency_key: idempotency_key,
            customer_id : customer_id
        };
    
        const respone = await payments_api.createPayment(payment_body);
        
        const history = await firestore().collection("payment_history").add({
            uid : userId,
            username : userName,
            price : price, 
            email : emailAddress,
            paidBy : "card",
            currency : "USD",
            customer_id : customer_id
        })
        response.status(200).send(JSON.stringify({payment : respone, customer : customer, card : card}));

    } catch (error) {
        response.status(500).send(JSON.stringify({error : error}));
    }

});