
import React, { useState } from 'react';
import './App.css';

const keyArr = [
  {
    sym: 0,
    name: "zero"
  },
  {
    sym: 1,
    name: "one"
  },
  {
    sym: 2,
    name: "two"
  },
  {
    sym: 3,
    name: "three"
  },
  {
    sym: 4,
    name: "four"
  },
  {
    sym: 5,
    name: "five"
  },
  {
    sym: 6,
    name: "six"
  },
  {
    sym: 7,
    name: "seven"
  },
  {
    sym: 8,
    name: "eight"
  },
  {
    sym: 9,
    name: "nine"
  },
  {
    sym: "+",
    name: "add"
  },
  {
    sym: "-",
    name: "subtract"
  },
  {
    sym: "*",
    name: "multiply"
  },
  {
    sym: "/",
    name: "divide"
  },
  {
    sym: "=",
    name: "equals"
  },
  {
    sym: ".",
    name: "decimal"
  },
  {
    sym: "AC",
    name: "clear"
  },
  {
    sym: "ANS",
    name: "answer"
  }
]

function KeyButton(props) {
  const val = props.val;
  const inp = props.input;
  const exp = props.expression;
  // Only allow valid input to be passed into setInput
  const clickHandler = () => {

    // Evaluate number type
    if (typeof val == "number") {
      // if input is an empty string
      if (/^[1-9]\d*|^$|\.|^[-+*/]|^0\./.test(inp)) {
        const newInput = inp.concat(val);
        const newDisplay = exp.concat(val)
        props.parentCallback({
          type: "NUM",
          inputVal: newInput,
          displayVal: newDisplay
        })
      }
      // if input is a zero
      if (/^00/.test(inp) || /=/.test(inp)) {
        const newInput = "".concat(val);
        const newDisplay = "".concat(val);
        props.parentCallback({
          type: "NUM",
          inputVal: newInput,
          displayVal: newDisplay
        })
      }
      // if input is an operator
      if (/[+*\-/]/.test(inp)) {
        const newInput = "".concat(val);
        const newDisplay = exp.concat(val)
        props.parentCallback({
          type: "NUM",
          inputVal: newInput,
          displayVal: newDisplay
        })
      }

    }
    // Evaluate decimal input
    if (val === ".") {
      if (inp.match(/\./g) == null) {
        const newInput = inp.concat(val);
        const newDisplay = exp.concat(val);
        props.parentCallback({
          type: "DEC",
          inputVal: newInput,
          displayVal: newDisplay
        })
      }
      if (/[+*/]/.test(inp)) {
        const newInput = "".concat(val);
        const newDisplay = exp.concat(val);
        props.parentCallback({
          type: "DEC",
          inputVal: newInput,
          displayVal: newDisplay
        })
      }
    }
    // Evaluate operators input
    if (/[+\-*/]/.test(val)) {

      if (!/^$|\.|[+*/]/.test(inp) || !(inp === ".")) {
        const newInput = "".concat(val);
        const newDisplay = exp.concat(" ", val, " ");
        props.parentCallback({
          type: "OP",
          inputVal: newInput,
          displayVal: newDisplay
        });
      }
      if (/[*/]/.test(inp) && /[*/]/.test(val)) {
        const newInput = "".concat(val);
        const newDisplay = exp.replace(/[*/] $/, `${val} `);
        props.parentCallback({
          type: "OP",
          inputVal: newInput,
          displayVal: newDisplay
        })
      }
      /* If 2 or more operators are entered consecutively, 
      the operation performed should be the last operator entered 
      (excluding the negative (-) sign) */
      if (/( [*/+-] ){2,}/.test(exp)) {
        const newInput = "".concat(val);
        const newDisplay = exp.replace(/( [*/+-] ){2,}/, ` ${val} `);
        props.parentCallback({
          type: "OP",
          inputVal: newInput,
          displayVal: newDisplay
        })
      }
    }
    // Evaluate EQUALS input
    if (val === "=") {
      const result = eval(exp);
      const newDisplay = "".concat(result);
      const newInput = "".concat(val);
      return props.parentCallback(
        {
          type: "CALC",
          displayVal: newDisplay,
          inputVal: newInput,
          answerVal: result
        })
    }
    // Evaluate ALL CLEAR input
    if (val === "AC") {
      props.parentCallback({
        type: "CLR"
      });
    }
    // Evaluate ANSWER input
    // Todo: You need to elaborate on this feature
    if (val === "ANS") {
      props.parentCallback(
        {
          type: "ANS"
        })
    }
  }
  // Conditional rendering for different kinds of buttons
  return (
    props.val === "=" ?
      <div id={props.id} className="btn btn-warning" onClick={clickHandler}>{val}</div>
      : props.val === "AC" ? <div id={props.id} className="btn btn-danger" onClick={clickHandler}>{val}</div>
        : typeof props.val == "number" ? <div id={props.id} className="btn btn-primary" onClick={clickHandler}>{val}</div>
          : <div id={props.id} className="btn btn-secondary" onClick={clickHandler}>{val}</div>
  )
};


function App() {
  const [input, setInput] = useState("");
  const [expression, setExpression] = useState("")
  const [answer, setAnswer] = useState("");

  const handleCallback = (childData) => {
    // Check input received from callback before setting states
    if (childData.type === "CALC") {
      setInput(childData.inputVal)
      setExpression(childData.displayVal)
      setAnswer(childData.answerVal)
      //Problematic...! setInput(childData.data);
    } else if (childData.type === "CLR") {
      setInput("")
      setExpression("")
      setAnswer("")
    } else if (childData.type === "NUM") {
      setInput(childData.inputVal)
      setExpression(childData.displayVal)
    } else if (childData.type === "DEC") {
      setInput(childData.inputVal)
      setExpression(childData.displayVal)
    } else if (childData.type === "OP") {
      setExpression(childData.displayVal)
      setInput(childData.inputVal)
    } else if (childData.type === "ANS") {
      setExpression(answer)
      setInput("")
    } else {
      setInput("error");
    }
  };

  return (
    <div className="container p-5">
      <div className="col">
        <h5 className="text-center">JavaScript Calculator</h5>
        <div className="calculator">
          <div id="display" className="bg-light">{input === "" ? 0 : expression}</div>
          {keyArr.map(ele => (
            <KeyButton
              key={ele.name}
              id={ele.name}
              val={ele.sym}
              input={input}
              expression={expression}
              answer={answer}
              parentCallback={handleCallback}
            />
          ))}
        </div>
      </div>
    </div>
  )
};

export default App;
