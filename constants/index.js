
export const CLOUD_URL = "https://us-central1-pursue2020.cloudfunctions.net/"

export const relationStatus = [ "Single","Divorced", "Widow/Widower","Prefer Not to Say" ];
export const religiousAffiliation = [ 
    "Baptist",
    "Catholic", 
    "Congregationalist",
    "Episcopal",
    "Methodist",
    "Presbyterian",
    "Non-Denominational",
    "Independent",
    "Pentecostal / Charismatic", 
    "Lutheran","Reformed",
    "Adventist",
    "Church of Christ", 
    "Jehovah Witness",
    "Apostolic",
    "Evangelical",
    "No Affiliation",
    "Other"
];

export const occupations = [
    "Technician",
    "Athlete",
    "Student",
    "Researcher",
    "Business Owner",
    'Self-Employed',
    'Lawyer/Attorney',
    'Cosmetologist',
    'Barber',
    'Hair Stylist',
    'Beautician',
    'Make Up Artist',
    'Therapist',
    'Physician',
    'Nurse',
    'Nurse Aid',
    'Psychologist',
    'Electrician',
    'Plumber',
    'Minister',
    'Pastor',
    'Musician',
    'Architect',
    'Dentist',
    'Dental Assistant',
    'Dental Hygienist',
    'Software Developer',
    'Engineer',
    'Occupational Therapist',
    'Accountant',
    'Veterinarian',
    'Teacher',
    "Teacher's Assistant",
    'Principal',
    'Professor',
    'Artist',
    'Military',
    'Public Official',
    'Politician',
    'Civil Servant',
    'Pharmacist',
    'Nutritionist',
    'Dietician',
    'Scientist',
    'Writer',
    'Singer/Song Writer',
    'Mechanic',
    'Truck Driver',
    'Secretary',
    'Book Keeper',
    'Administrative Assistant',
    'Executive Assistant',
    'Actor',
    'Cook',
    'Chef',
    'Business Developer',
    'Librarian',
    'Bio-Med',
    'Waiter/Waitress',
    'Store Clerk',
    'Retail',
    'Police Officer',
    'Firefighter',
    'Bartender',
    'Designer',
    'Broker',
    'Finance',
    'Landscaper/Gardener',
    'Real Estate',
    'Medical Field',
    'Postal Worker',
    'Media',
    'Journalist',
    'Farmer',
    'Education',
    'Technology',
    'Government/ Public Administration',
    'Hospitality/Tourism',
    'Business Management/Administration',
    'Health Science',
    'Arts',
    'Communications',
    'Information Technology',
    'Marketing/ Sales',
    'Manufacturing',
    'Human Services',
    'Non-Profit',
    'Construction',
    'Natural Resources',
    'Transportation/Distribution',
];

export const ethnicity = [
    "African American",
    "Native America in the United States",
    "Pacific Islander American",
    "Puerto Rican",
    "Mexican American",
    "American",
    "White People",
    "Black People",
    "Native Hawaiian",
    "Asian American",
    "Indian American",
    "Hispanic",
    "Korean",
    "Chinese American",
    "Irish American",
    "German American",
    "Italian American",
    "Japanese American",
]

export const interests = [
    "Straight",
    "Gay",
    "Lesbian",
    "Bisexual",
    "Asexual",
    "Demisexual",
    "Pan Sexual",
]

export const lookingfor = [
    "Chating",
    "Dating",
    "Wedding",
    "Children"
]

export const plansList = [
    {
        id : "plus",
        title : "Pursue Plus",
        description : "Get more lovin’ and caring everyday!",
        prices : {
            1 : {
                price : 9.99
            },
            3 : {
                price : 19.99,
                ppm : 6.66,
                save : 33
            },
            6 : {
                price : 29.99,
                ppm : 4.99,
                save : 50
            }
        },
        icon : require("../assets/images/heart-pink.png"),
        features : [
            "Unlimited Likes",
            "Rewind your last swipe",
            "5 super Likes per day",
            "1 Boost a month",
            "Passport to swipe around the world"
        ],
        colors : ["#DA1DA2", "#6D0F51"]

    },
    {
        id : "gold",
        title : "Pursue Gold",
        description : "You get access to all the same features that Plus offers, as well as exclusive access to see who Likes You and Top Picks features",
        prices : {
            1 : {
                price : 14.99
            },
            3 : {
                price : 24.99,
                ppm : 8.33,
                save : 55
            },
            6 : {
                price : 34.99,
                ppm : 5.83,
                save : 75
            }
        },
        icon : require("../assets/images/heart-gold.png"),
        features : [
            "Same as Pursue Plus",
            "See who Likes You!",
            "Top Picks"
        ],
        colors : ["#FFD428","#F5A623"]

    },
    {
        id :"matchmaker",
        title : "Matchmaker",
        description : "Your own matchmaker. This plan gives you all of the same features of Plus and Gold.  Plus more..",
        prices : {
            1 : {
                price : 39.99
            },
            3 : {
                price : 49.99,
                ppm : 16.67,
                save : 60
            },
            6 : {
                price : 59.99,
                ppm : 9.99,
                save : 75
            }
        },
        icon : require("../assets/images/heart-blue.png"),
        features : [
            "Same as Pursue Plus & Gold",
            "10 Super Likes per day",
            "2 Boost a month",
            "Preference Matches"
        ],
        colors : ["#4A90E2","#4252FF"]

    }
];


const boostPackages = [
    { 
        count : 1,
        price : 3.99
    },
    { 
        count : 5,
        price : 9.99
    },
    { 
        count : 10,
        price : 14.99
    }
]

const superLikePackages = [
    { 
        count : 1,
        price : 2.99
    },
    {
        count : 5,
        price : 4.99
    },
    {
        count : 10,
        price : 8.99
    }
]