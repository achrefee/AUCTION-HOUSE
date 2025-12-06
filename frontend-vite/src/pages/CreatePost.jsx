import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [deadline, setDeadline] = useState(null); // Date object
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!deadline || deadline < new Date()) {
    setError("Please select a future deadline.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("startingPrice", startingPrice);
  formData.append("deadline", deadline.toISOString().slice(0, 19)); // Ex: "2025-04-14T15:30:00"

  
  if (image) formData.append("image", image);

  try {
    await axios.post("http://localhost:9090/api/posts", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    navigate("/home");
  } catch (err) {
    const message =
      err.response?.data || "Failed to create post. Please try again.";
    setError(message);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-12 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl space-y-8"
      >
        <h2 className="text-3xl font-bold text-center text-blue-300">
          Create New Auction
        </h2>

        {error && (
  <p className="text-red-400 text-center text-sm font-medium">
    {typeof error === "string" ? error : error.error || "An unknown error occurred."}
  </p>
)}


        {/* 📸 Image Upload */}
        <div className="flex flex-col items-center gap-3">
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 transition px-6 py-4 rounded-xl border border-white/20 w-full"
          >
            <FaCamera className="text-2xl mb-1 text-blue-400" />
            <span className="text-sm text-white">Click to upload image</span>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-xl mt-2 max-h-48 object-cover border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {/* 🧾 Input Fields */}
        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Title"
            className="bg-white/10 placeholder-gray-400 text-white px-5 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            rows={4}
            className="bg-white/10 placeholder-gray-400 text-white px-5 py-3 rounded-xl resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* 💲 Starting Price with Icon */}
          <div className="relative">
            <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              placeholder="Starting Price"
              className="appearance-none pl-10 pr-4 py-3 w-full bg-white/10 placeholder-gray-400 text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              required
            />
          </div>

          {/* 📅 Deadline with validation */}
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select deadline"
              className="pl-10 pr-4 py-3 w-full bg-white/10 placeholder-gray-400 text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              minDate={new Date()}
              minTime={
                deadline &&
                new Date(deadline).toDateString() === new Date().toDateString()
                  ? new Date()
                  : new Date(0, 0, 0, 0, 0)
              }
              maxTime={new Date(0, 0, 0, 23, 45)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-md"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}
