import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    description: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return null;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData)

      if (data.success) {
        toast.success(data.message || "Car Added Successfully");
        setImage(null);
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: '',
          location: '',
          description: '',
        })
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 md:px-10 bg-gray-50">
      <div className="w-full max-w-2xl">
        <Title
          title={"Add New Car"}
          subtitle={"Fill In The Details To List A New Car For Booking, Including Pricing, Availability, And Car Specification."}
        />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 text-gray-500 text-sm mt-6 bg-white p-6 rounded-lg shadow-md"
        >
          {/* Car Image */}
          <div className="flex items-center gap-2 w-full">
            <label htmlFor="car-image">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_icon}
                alt=""
                className="h-14 rounded cursor-pointer"
              />
              <input
                type="file"
                id="car-image"
                accept="image/*"
                hidden
                onChange={e => setImage(e.target.files[0])}
              />
            </label>
            <p className="text-sm text-gray-500">Upload A Picture Of Your Car</p>
          </div>

          {/* Car Brand And Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            <div className="flex flex-col w-full">
              <label>Brand</label>
              <input
                type="text"
                placeholder="eg. BMW, Mercedes, Audi... & Many More"
                required
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                value={car.brand}
                onChange={e => setCar({ ...car, brand: e.target.value })}
              />
            </div>

            <div className="flex flex-col w-full">
              <label>Model</label>
              <input
                type="text"
                placeholder="eg. X5, E-CLass, M4"
                required
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                value={car.model}
                onChange={e => setCar({ ...car, model: e.target.value })}
              />
            </div>
          </div>

          {/* Car Year, Price and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            <div className="flex flex-col w-full">
              <label>Year</label>
              <input
                type="number"
                placeholder="2025"
                required
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                value={car.year}
                onChange={e => setCar({ ...car, year: e.target.value })}
              />
            </div>

            <div className="flex flex-col w-full">
              <label>Daily Price({currency})</label>
              <input
                type="number"
                placeholder="100"
                required
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                value={car.pricePerDay}
                onChange={e => setCar({ ...car, pricePerDay: e.target.value })}
              />
            </div>

            <div className="flex flex-col w-full">
              <label>Category</label>
              <select
                onChange={e => setCar({ ...car, category: e.target.value })}
                value={car.category}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              >
                <option value="">Select A Category</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
              </select>
            </div>
          </div>

          {/* Car Transmission, Fuel Type, Seating Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            <div className="flex flex-col w-full">
              <label>Transmission</label>
              <select
                onChange={e => setCar({ ...car, transmission: e.target.value })}
                value={car.transmission}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              >
                <option value="">Select A Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Semi-Automatic">Semi-Automatic</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label>Fuel Type</label>
              <select
                onChange={e => setCar({ ...car, fuel_type: e.target.value })}
                value={car.fuel_type}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              >
                <option value="">Select A Fuel Type</option>
                <option value="Gas">Gas</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label>Seating Capacity</label>
              <input
                type="number"
                placeholder="4"
                required
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                value={car.seating_capacity}
                onChange={e => setCar({ ...car, seating_capacity: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label>Location</label>
            <select
              onChange={e => setCar({ ...car, location: e.target.value })}
              value={car.location}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select A Location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Houston">Houston</option>
              <option value="Chicago">Chicago</option>
              <option value="Manchester">Manchester</option>
            </select>
          </div>

          {/* Car Description */}
          <div className="flex flex-col w-full">
            <label>Description</label>
            <textarea
              rows={5}
              placeholder="A Luxurious SUV With A Spacious Interior And A Powerful Engine."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.description}
              onChange={e => setCar({ ...car, description: e.target.value })}
            ></textarea>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer">
            <img src={assets.tick_icon} alt="" />
            {isLoading ? 'Listing...' : `List Your Car`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCar
