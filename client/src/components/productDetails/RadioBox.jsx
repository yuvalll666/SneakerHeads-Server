import React, { useState } from "react";
import { Collapse, Radio } from "antd";
const { Panel } = Collapse;

/**
 * Component - RadioBox
 * @component
 * @param {Object} props - Object containes handleFilters function 
 */
function RadioBox(props) {
  const [Value, setValue] = useState(0);

 // Redner radio buttons
  const renderRadioBox = () =>
    props.price.map((value) => (
      <Radio key={value._id} value={value._id}>
        {value.name}
      </Radio>
    ));

    /**
     * Pass filter to father component
     * @event e {onChange}
     */
  const handleChange = (e) => {
    const { value } = e.target;
    setValue(value);

    props.handleFilters(value);
  };
  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Panel header="Price range" key="1">
          <Radio.Group onChange={handleChange} value={Value}>
            {renderRadioBox()}
          </Radio.Group>
        </Panel>
      </Collapse>
    </div>
  );
}

export default RadioBox;
