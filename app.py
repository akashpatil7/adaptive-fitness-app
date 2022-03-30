import firebase_admin
from flask import Flask, make_response
from flask import json, request
from firebase_admin import credentials, firestore

cred = credentials.Certificate("blackbird-545eb-firebase-adminsdk-mbj63-3e346d4374.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
explicit_data = db.collection('explicit-info')
exercise_plans_data = db.collection('exercise')
food_plans_data = db.collection('food_plan')

app = Flask(__name__)

@app.route("/")
def hello_world():
    return make_response("Hello world", 200)

@app.route('/explicit', methods=['POST'])
def enterQuestionaireForm():
    id = request.json['email']

    explicit_data.document(id).set(request.json)

    #Get the initial diet and workout plan
    data = getInitialPlansForUser(request.json)

    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response

#Show workout plans for user

#Show diet plans for user


#Update data for user
def getInitialPlansForUser(data):
    bmr = 0
    if data["gender"] is "male":
        bmr = 66.5 + (13.75 * data["weight"]) + (5.003 * data["height"]) - (4.676 * data["age"])
    elif data["gender"] is "female":
        bmr = 655.1 + (9.563 * data["weight"]) + (1.850 * data["height"]) - (4.676 * data["age"])

    plans_by_weight_goals = food_plans_data.document(data["weight_goals"]).get().to_dict()
    plans_by_diet_restrictions = plans_by_weight_goals[data["dietary_restrictions"]]

    total_cals_in_plans = 0
    total_cals_per_meal = {}
    for meal in plans_by_diet_restrictions:
        total_cals_in_plans += meal["nutrition"]["cal"]
        total_cals_per_meal[meal] = meal["nutrition"]["cal"]

    if bmr < total_cals_in_plans:
        return plans_by_diet_restrictions
    else:
        extra_calories_needed_per_meal = (bmr - total_cals_in_plans)/3
        new_plan = plans_by_diet_restrictions
        for meal in new_plan:
            for ingredient, val in meal["ingredients"].items():
                val += val * (extra_calories_needed_per_meal / total_cals_per_meal[meal])
        return new_plan

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8005)