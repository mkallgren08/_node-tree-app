import React from "react";

const CustomForm = props => (
  <form>
    <div className="form-group">
      <label htmlFor="childName">
        <strong>Factory Name</strong>
      </label>
      <input
        className="form-control"
        id="childName"
        type="text"
        value={props.name}
        placeholder="Tom, Dick, or Harry"
        name="childName"
        onChange={props.handleInputChange}
        required
      />
      <label htmlFor="numGrandchildren">
        <strong>Number of Nodes</strong>
      </label>
      <input
        className="form-control"
        id="numGrandchildren"
        type="number"
        value={props.number}
        placeholder="3"
        name="numGrandchildren"
        onChange={props.handleInputChange}
        required
      />
      <label htmlFor="minVal">
        <strong>Min Range Val</strong>
      </label>
      <input
        className="form-control"
        id="minVal"
        type="number"
        value={props.minVal}
        placeholder="0"
        name="minVal"
        onChange={props.handleInputChange}
        required
      />
      <label htmlFor="maxVal">
        <strong>Max Range Val</strong>
      </label>
      <input
        className="form-control"
        id="maxVal"
        type="number"
        value={props.maxVal}
        placeholder="1000"
        name="maxVal"
        onChange={props.handleInputChange}
        required
      />
    </div>
    <div className="pull-right">
      <button onClick={props.handleModalClose}>Close</button>
      <button
        onClick={props.handleFormSubmit}
        type="submit"
        className="btn btn-lg btn-danger"
      >
        Submit
      </button>
    </div>
  </form>
);

export default CustomForm
