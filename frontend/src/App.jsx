import { useState } from "react";
import axios from "axios";
import "./App.css";

const initialForm = {
  Make: "",
  Model: "",
  Year: "",
  Engine_Size: "",
  Mileage: "",
  Fuel_Type: "",
  Transmission: "",
};

const fields = [
  { name: "Make", label: "Make", placeholder: "Toyota", type: "text" },
  { name: "Model", label: "Model", placeholder: "Corolla", type: "text" },
  { name: "Year", label: "Year", placeholder: "2021", type: "number" },
  { name: "Engine_Size", label: "Engine Size", placeholder: "2.0", type: "number", step: "0.1" },
  { name: "Mileage", label: "Mileage", placeholder: "18000", type: "number" },
  { name: "Fuel_Type", label: "Fuel Type", placeholder: "Petrol", type: "text" },
  { name: "Transmission", label: "Transmission", placeholder: "Automatic", type: "text" },
];

function App() {
  const [form, setForm] = useState(initialForm);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const predict = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", form);
      setPrice(res.data["Predicted Price"]);
    } catch (err) {
      console.error(err);
      alert("Prediction Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">AI-powered valuation</p>
          <h1>Find your car’s true market value</h1>
          <p className="subtitle">
            Enter a few details and get a realistic price estimate in seconds.
          </p>

          <div className="stats-grid">
            <div>
              <strong>Fast</strong>
              <span>Instant results</span>
            </div>
            <div>
              <strong>Smart</strong>
              <span>Data-driven estimate</span>
            </div>
            <div>
              <strong>Simple</strong>
              <span>Easy to use</span>
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-header">
            <h2>Car Price Predictor</h2>
            <p>Fill in the details below to estimate the price.</p>
          </div>

          <div className="form-grid">
            {fields.map((field) => (
              <label key={field.name} className="input-group">
                <span>{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  step={field.step}
                  onChange={handleChange}
                />
              </label>
            ))}
          </div>

          <button className="predict-btn" onClick={predict} disabled={loading}>
            {loading ? "Predicting..." : "Predict Price"}
          </button>

          {price !== "" && (
            <div className="price-card">
              <p>Estimated Market Price</p>
              <h3>₹ {Number(price).toLocaleString("en-IN")}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;