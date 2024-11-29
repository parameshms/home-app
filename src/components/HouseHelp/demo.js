<div className="container mx-auto mt-4 p-4 font-poppins max-w-lg">
<div className="flex items-center gap-2 mb-4">
  {/* <img
    src={leftArrowIcon}
    alt="Back"
    onClick={handleBackButtonClick}
    className="cursor-pointer"
  /> */}
   <img 
      src={leftArrowIcon} 
      alt="" 
      onClick={() => handleBackButtonClick()} 
      className="w-10 h-10 cursor-pointer" 
  />
  <h2 className="text-[18px] font-semibold">Add Househelp</h2>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

  <div>
    <input
      type="text"
      name="name"
      value={newHouseHelp.name}
      onChange={handleInputChange}
      className={`border p-2 rounded w-full block ${
        errors.name ? "border-red-500" : ""
      }`}
      placeholder="Name"
    />
    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
  </div>


  <div>
    <input
      type="text"
      name="phone_number"
      value={newHouseHelp.phone_number}
      onChange={handleInputChange}
      className={`border p-2 rounded w-full block ${
        errors.phone_number ? "border-red-500" : ""
      }`}
      placeholder="Phone Number"
    />
    {errors.phone_number && (
      <p className="text-red-500 text-sm">{errors.phone_number}</p>
    )}
  </div>

  <div>
<input
  type="text"
  name="adhar"
  value={newHouseHelp.adhar}
  onChange={handleInputChange}
  className="border p-2 rounded w-full block"
  placeholder="Aadhar"
  required
/>
</div>
<div>
<input
  type="text"
  name="address"
  value={newHouseHelp.address}
  onChange={handleInputChange}
  className="border p-2 rounded w-full block"
  placeholder="Address"
  required
/>
</div>


<div>
<label>Start date</label>
<input
  type="date"
  name="start_date"
  value={newHouseHelp.start_date}
  onChange={handleInputChange}
  className="border p-2 rounded w-full block"
  required
/>
</div>
<div>
      <label>End date</label>
      <input
        type="date"
        name="end_date"
        value={newHouseHelp.end_date}
        onChange={handleInputChange}
        className={`border p-2 rounded w-full block ${
          errors.end_date ? "border-red-500" : ""
        }`}
      />
      {errors.end_date && (
        <p className="text-red-500 text-sm">{errors.end_date}</p>
      )}
    </div>


<div>
<select
  name="gender"
  value={newHouseHelp.gender}
  onChange={handleInputChange}
  className="border p-2 rounded w-full block"
  required
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>
</div>

<div>
<select
  name="payment_type"
  value={newHouseHelp.payment_type}
  onChange={handleInputChange}
  className="border p-2 rounded w-full block"
  required
>
  <option value="">Payment Type</option>
  <option value="Daily">Daily</option>
  <option value="Weekly">Weekly</option>
  <option value="Monthly">Monthly</option>
  <option value="Yearly">Yearly</option>
</select>
</div>

<div>
<input
  type="text"
  name="total_value"
  value={newHouseHelp.total_value}
  onChange={handleInputChange}
  className="border p-2 rounded w-full block"
  placeholder="Total Value"
  required
/>
</div>


<div>
          <select
              name="role"
              value={newHouseHelp.role}
              onChange={handleInputChange}
              className="border p-2 rounded w-full block"
              required
          >
              <option value="">Select Role</option>
              {roles.map((role) => (
                  <option key={role._id} value={role.name}>{role.category_name}</option>
              ))}
          </select>
</div>

<div>
      <select
        name="payment_mode"
        value={newHouseHelp.payment_mode}
        onChange={handleInputChange}
        className={`border p-2 rounded w-full block ${
          errors.payment_mode ? "border-red-500" : ""
        }`}
      >
        <option value="">Payment Mode</option>
        <option value="Cash">Cash</option>
        <option value="UPI">UPI</option>
        <option value="Bank Transfer">Bank Transfer</option>
      </select>
      {errors.payment_mode && (
        <p className="text-red-500 text-sm">{errors.payment_mode}</p>
      )}
    </div>
    <div>
        <input
          type="text"
          name="UPI_ID"
          value={newHouseHelp.UPI_ID}
          onChange={handleInputChange}
          className={`border p-2 rounded w-full block ${
            errors.UPI_ID ? "border-red-500" : ""
          }`}
          placeholder="UPI ID"
        />
        {errors.UPI_ID && (
          <p className="text-red-500 text-sm">{errors.UPI_ID}</p>
        )}
      </div>

      {newHouseHelp.payment_mode === "Bank Transfer" && (
      <>
        <div>
          <input
            type="text"
            name="acc"
            value={newHouseHelp.acc}
            onChange={handleInputChange}
            className={`border p-2 rounded w-full block ${
              errors.acc ? "border-red-500" : ""
            }`}
            placeholder="Account Number"
          />
          {errors.acc && (
            <p className="text-red-500 text-sm">{errors.acc}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="ifsc"
            value={newHouseHelp.ifsc}
            onChange={handleInputChange}
            className={`border p-2 rounded w-full block ${
              errors.ifsc ? "border-red-500" : ""
            }`}
            placeholder="IFSC Code"
          />
          {errors.ifsc && (
            <p className="text-red-500 text-sm">{errors.ifsc}</p>
          )}
        </div>
      </>
    )}

<div>
<label>Payment Date</label>
<input
  type="date"
  name="payment_date"
  value={newHouseHelp.payment_date}
  onChange={handleInputChange}
  className="border p-2 rounded w-full block"
  required
/>
</div>

  <div className="flex gap-2 col-span-2">
    <button
      onClick={handleCreateHousehelp}
      className="text-white p-2 rounded w-full block"
      style={{ background: "#3d6464" }}
    >
      Submit
    </button>
    <button
      onClick={handleCancel}
      className="bg-red-400 text-white p-2 rounded w-full block"
    >
      Cancel
    </button>
  </div>
</div>

{error && <div className="text-red-500 col-span-2">{error}</div>}
</div>