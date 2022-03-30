/*
* Contains N request interface function modules
* */
import ajax from './ajax'
const BASE = ''
const POST = 'POST'
const GET = 'GET'
const registerUrl = '/register'


/*
Registered users
{
    "email":"123@123.com",
    "password":"112233",
    "confirm":"112233",
    "height":11,
    "weight":11,
    "weight_goals":"weight maintain",
    "age":11,
    "gender":"female",
    "dietary_restrictions":"no",
    "gym_equipment":[
        "no"
    ],
    "activity_level":"sedentary",
    "experience":"1 month"
}
*/
export function reqRegister(registerData)
{
    return ajax(BASE+registerUrl,registerData,POST)
}


