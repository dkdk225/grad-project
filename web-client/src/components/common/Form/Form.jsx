import "./Form.css";
import { useState } from "react";
import { Button, TextField } from "@mui/material";

const handleChange = (setValue) => {
  return (e) => setValue(e.target.value);
};

const handleSubmit = (states, onSubmit, fields) => {
  const formDict = {};
  for (let field of fields) {
    let formField = field.replace(/\W+(.)/g, function (match, chr) {
      return chr.toUpperCase();
    });
    formField = formField.charAt(0).toLowerCase() + formField.slice(1)
    formDict[formField] = states[field].value;
  }
  return (e) => {
    e.preventDefault()
    onSubmit(formDict);
  };
};

function Form({
  fields = [],
  onSubmit = (formDict) => {},
  submitName = "Submit",
  className = "",
}) {
  const states = {};
  for (let field of fields) {
    const [value, setValue] = useState("");
    states[field] = { value, setValue };
  }
  return (
    <>
      <form onSubmit={handleSubmit(states, onSubmit, fields)} className={"form " + className}>
        {fields.map((field, index) => {
          const { value, setValue } = states[field];
          let type = "";
          if (field[0] === "*") {
            field = field.slice(1);
            type = "password";
          }

          return (
            <TextField
              key={index}
              className="form_field"
              value={value}
              onChange={handleChange(setValue)}
              label={field}
              type={type}
              variant="standard"
            />
          );
        })}
        <Button type="submit" className="form_button" variant="contained">
          {submitName}
        </Button>
      </form>
    </>
  );
}

export default Form;
