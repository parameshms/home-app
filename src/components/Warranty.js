import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import leftArrowIcon from "../assests/leftArrow.svg";

export default function Warranty() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    brand: "",
    purchase_date: "",
    warranty: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const API = process.env.REACT_APP_API

  const handleBackButtonClick = () => {
    window.history.back();
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API}warranties/getData`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setProducts(response.data.data || []);
      setError("");
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.product_name ||
        !formData.product_type ||
        !formData.brand ||
        !formData.purchase_date ||
        !formData.warranty
      ) {
        setError("All fields except price are required.");
        return;
      }

      // Validate purchase date
      const currentDate = new Date();
      const purchaseDate = new Date(formData.purchase_date);
      if (purchaseDate > currentDate) {
        setError("Purchase date cannot be in the future.");
        return;
      }

      const response = await axios.post(
        `${API}warranties/addData`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAlertMessage(response.data.message);
      setFormData({
        product_name: "",
        product_type: "",
        brand: "",
        purchase_date: "",
        warranty: "",
        price: "",
      });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError("Failed to add product. Please check the data and try again.");
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `${API}warranties/delete`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { product_id: productId },
        }
      );
      setAlertMessage(response.data.message);
      fetchProducts();
    } catch (err) {
      setError("Failed to remove product. Please try again.");
    }
  };

  const calculateWarrantyLeft = (purchaseDate, warranty) => {
    const currentDate = new Date();
    const endDate = new Date(purchaseDate);
    endDate.setMonth(endDate.getMonth() + parseInt(warranty, 10));
    const diff = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24 * 30)); 
    return diff > 0 ? diff : 0; 
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col items-center bg-gray-100 py-10 font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="flex items-center gap-4 mb-8">
          <img
            src={leftArrowIcon}
            alt="Back"
            onClick={handleBackButtonClick}
            className="w-8 h-8 cursor-pointer hover:opacity-80"
          />
          <h3 className="text-3xl font-bold text-gray-800">Track Warranties</h3>
        </div>

        {alertMessage && (
          <div className="mb-4 p-2 text-green-700 bg-green-100 rounded">
            {alertMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-2 text-red-700 bg-red-100 rounded">{error}</div>
        )}

        {products.length === 0 && !showForm && (
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              Warranty details not added yet.
            </p>
          </div>
        )}

        {showForm && (
          <form
            className="p-6 border border-gray-300 shadow-md rounded-lg bg-white mb-8"
            onSubmit={handleAddProduct}
          >
            <h4 className="text-xl font-semibold text-gray-700 mb-4">
              Add a Product
            </h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full p-2 border rounded"
                value={formData.product_name}
                onChange={(e) =>
                  setFormData({ ...formData, product_name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Product Type"
                className="w-full p-2 border rounded"
                value={formData.product_type}
                onChange={(e) =>
                  setFormData({ ...formData, product_type: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Brand"
                className="w-full p-2 border rounded"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
              />
              <div>
                <label>Purchase date</label>
                <input
                  type="date"
                  placeholder="Purchase Date"
                  className="w-full p-2 border rounded"
                  value={formData.purchase_date}
                  onChange={(e) =>
                    setFormData({ ...formData, purchase_date: e.target.value })
                  }
                  required
                />
              </div>
              <input
                type="number"
                placeholder="Warranty (in months)"
                className="w-full p-2 border rounded"
                value={formData.warranty}
                onChange={(e) =>
                  setFormData({ ...formData, warranty: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full p-2 border rounded"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Add Product
            </button>
          </form>
        )}

        {products.map((product) => (
          <div
            key={product._id}
            className="p-6 border border-gray-300 shadow-md rounded-lg bg-white mb-4"
          >
            <div className="text-lg font-medium text-gray-700">
              {product.product_name}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Price:</span> ₹ {product.price}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Purchase Date:</span>{" "}
              {product.purchase_date}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Warranty Left:</span>{" "}
              {calculateWarrantyLeft(product.purchase_date, product.warranty)}{" "}
              months
            </div>
            <div className="mt-2">
              <Link
                to={`https://www.google.com/search?q=${product.brand}+service+center+near+me`}
              >
                <button className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600">
                  Find Service Centers
                </button>
              </Link>
              <button
                onClick={() => handleRemoveProduct(product._id)}
                className="bg-slate-400 text-white py-1 px-3 ml-4 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      )}
    </div>
  );
}
