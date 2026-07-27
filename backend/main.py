from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and feature columns
model = joblib.load("car_price_model.pkl")
columns = joblib.load("encoder_columns.pkl")


class Car(BaseModel):
    Make: str
    Model: str
    Year: int
    Engine_Size: float
    Mileage: int
    Fuel_Type: str
    Transmission: str


@app.get("/")
def home():
    return {"message": "Car Price Prediction API is Running"}


@app.post("/predict")
def predict(car: Car):

    data = {
        "Year": [car.Year],
        "Engine Size": [car.Engine_Size],
        "Mileage": [car.Mileage],
        "Make": [car.Make],
        "Model": [car.Model],
        "Fuel Type": [car.Fuel_Type],
        "Transmission": [car.Transmission]
    }

    df = pd.DataFrame(data)

    # Apply one-hot encoding
    df = pd.get_dummies(
        df,
        columns=["Make", "Model", "Fuel Type", "Transmission"]
    )

    # Match training columns
    df = df.reindex(columns=columns, fill_value=0)

    prediction = model.predict(df)[0]

    return {
        "Predicted Price": round(float(prediction), 2)
    }