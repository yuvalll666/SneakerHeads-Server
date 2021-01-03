import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";
const { Panel } = Collapse;

/**
 * Component - CheckBox
 * @component
 * @param {Object} props - Containes handleFilters
 * @see handleFilters
 */
function CheckBox(props) {
  const [Checked, setChecked] = useState([]);

  /**
   * Add or remove checkBox value from array
   * @param {String} value - brand _id
   */
  const handleToggle = (value) => {
    const currentIndex = Checked.indexOf(value);
    const newChecked = [...Checked];
    // If value not exists in the array push it in
    if (currentIndex === -1) {
      newChecked.push(value);
      //Remove item from the array if exists
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    // Pass filter array to father component
    props.handleFilters(newChecked);
  };

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Choose a brand" key="1">
          {props.brands.map((brand, index) => (
            <React.Fragment key={index}>
              <Checkbox
                onChange={() => handleToggle(brand._id)}
                type="checkbox"
                checked={Checked.indexOf(brand._id) === -1 ? false : true}
              />
              <span className="ml-1 mr-2">{brand.name}</span>
            </React.Fragment>
          ))}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
