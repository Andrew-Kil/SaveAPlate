import React, {Component} from 'react'

const AddItemForm = (props) => {
  return(
    <>
  <form onSubmit={props.submitItem}>
  <input type="text" onChange={props.handleChange} name="quantity" placeholder="How many people can this donation feed?"/>
  <input type="text" onChange={props.handleChange} name="name" placeholder="What dish are you donating?"/>
  <p>What is the lastest time for pick up?</p>
  <select onChange={props.handleChange} name="set_time">
  <option value="null"> Select time </option>
  <option value="00:00"> 12:00 am </option>
  <option value="1:00"> 1:00 am </option>
  <option value="2:00"> 2:00 am </option>
  <option value="3:00"> 3:00 am </option>
  <option value="4:00"> 4:00 am </option>
  <option value="5:00"> 5:00 am </option>
  <option value="6:00"> 6:00 am </option>
  <option value="7:00"> 7:00 am </option>
  <option value="8:00"> 8:00 am </option>
  <option value="9:00"> 9:00 am </option>
  <option value="10:00"> 10:00 am </option>
  <option value="11:00"> 11:00 am </option>
  <option value="12:00"> 12:00 pm </option>
  <option value="13:00"> 1:00 pm </option>
  <option value="14:00"> 2:00 pm </option>
  <option value="15:00"> 3:00 pm </option>
  <option value="16:00"> 4:00 pm </option>
  <option value="17:00"> 5:00 pm </option>
  <option value="18:00"> 6:00 pm </option>
  <option value="19:00"> 7:00 pm </option>
  <option value="20:00"> 8:00 pm </option>
  <option value="21:00"> 9:00 pm </option>
  <option value="22:00"> 10:00 pm </option>
  <option value="23:00"> 11:00 pm </option>
  </select>
  <button type="submit">Add Food Item </button>
  </form>
    </>
  )
}

export default AddItemForm;