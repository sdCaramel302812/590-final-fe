import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { useState } from 'react';

interface ButtonProp {
  text: string
  onclick: () => void
}

function TextButton(props: ButtonProp) {
  return (
    <button 
      className={`Button`}
      onClick={props.onclick}
    >
      {props.text}
    </button>
  );
}

function ACButton(props: ButtonProp) {
  return (
    <button 
      className={`Button ButtonLeft`}
      onClick={props.onclick}
    >
      {props.text}
    </button>
  );
}

function EqualButton(props: ButtonProp) {
  return (
    <button 
      className={`Button ButtonRight`}
      onClick={props.onclick}
    >
      {props.text}
    </button>
  );
}

function Console(props: {text: string}) {
  return (
    <div className='Console'>
      {props.text}
    </div>
  );
}

async function apiCall(query: string) {
  const response = await fetch(process.env.REACT_APP_BACKEND_ENDPOINT + query, {method: "GET"});
  return await response.json();
}

function Calculator() {
  const [equation, setEquation] = useState('0');

  async function calculate(s: string) {
    if (isOperator(s[s.length - 1])) {
      return;
    }

    let prev = 0;
    const stack = new Array<number>();
    let operator = '+';
    for (let i = 0; i <= s.length; i++) {
      if ( i === s.length || 
        s[i] === 'x' || s[i] === '/' || 
        s[i] === '+' || s[i] === '-') {
        const n = Number(s.slice(prev, i));
        prev = i + 1;
        const back = stack.length - 1;
        switch(operator) {
          case '+':
            stack.push(n);
            break;
          case '-':
            stack.push(-n);
            break;
          case 'x':
            const multiquery = `/multiply?a=${stack[back]}&b=${n}`;
            stack[back] = (await apiCall(multiquery)).result;
            break;
          case '/':
            const divquery = `/divide?a=${stack[back]}&b=${n}`;
            stack[back] = (await apiCall(divquery)).result;
            break;
        }
        if (i === s.length) {
          break;
        }
        operator = s[i];
        if (i !== s.length && s[i + 1] === '-') {
          i++;
        }
      }
    }
    
    let result = 0;
    for (let i = 0; i < stack.length; i++) {
      const query = `/plus?a=${result}&b=${stack[i]}`;
      result = (await apiCall(query)).result;
    }

    const validEquation = s.replace(/x/g, '*');
    const validateQuery = `/validate?equation=${encodeURIComponent(validEquation)}&answer=${result}`
    await apiCall(validateQuery);
    setEquation(String(result));
  }

  function isOperator(s: string) {
    if (s === '+' || s === '-' || s === 'x' || s === '/') {
      return true;
    }
    return false;
  }

  function updateEquation(s: string) {
    if (s.length === 0) {
      setEquation('0');
      return;
    }
    // remove leading zero
    if (s.length > 1 && s[0] === '0' && !isNaN(Number(s.slice(1, 2)))) {
      s = s.slice(1, s.length);
    }

    // remove conequence operator
    if (s.length > 2 && isOperator(s[s.length - 1]) && 
        isOperator(s[s.length - 2]) && isOperator(s[s.length - 3])) {
      s = s.slice(0, s.length - 1);
    } else if (s.length > 1 && isOperator(s[s.length - 1]) && isOperator(s[s.length - 2])) {
      if (s[s.length - 1] === '-') {
        if (s[s.length - 2] === '+' || s[s.length - 2] === '-') {
          s = s.slice(0, s.length - 2) + '-';
        }
      } else {
        s = s.slice(0, s.length - 2) + s[s.length - 1];
      }
    }
    
    setEquation(s);
  }

  function containDot(s: string) {
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] === '+' || s[i] === '-' || s[i] === 'x' || s[i] === '/') {
        return false;
      }
      if (s[i] === '.') {
        return true;
      }
    }
    return false;
  }

  return (
    <div className='Calculator'>
      <Console
        text={equation}
      />
      <div className='ButtonGrid'>
        <TextButton
          text="1"
          onclick={() => updateEquation(equation + '1')}
        />
        <TextButton
          text="2"
          onclick={() => updateEquation(equation + '2')}
        />
        <TextButton
          text="3"
          onclick={() => updateEquation(equation + '3')}
        />
        <TextButton
          text="/"
          onclick={() => updateEquation(equation + '/')}
        />
        <TextButton
          text="4"
          onclick={() => updateEquation(equation + '4')}
        />
        <TextButton
          text="5"
          onclick={() => updateEquation(equation + '5')}
        />
        <TextButton
          text="6"
          onclick={() => updateEquation(equation + '6')}
        />
        <TextButton
          text="x"
          onclick={() => updateEquation(equation + 'x')}
        />
        <TextButton
          text="7"
          onclick={() => updateEquation(equation + '7')}
        />
        <TextButton
          text="8"
          onclick={() => updateEquation(equation + '8')}
        />
        <TextButton
          text="9"
          onclick={() => updateEquation(equation + '9')}
        />
        <TextButton
          text="-"
          onclick={() => updateEquation(equation + '-')}
        />
        <TextButton
          text="0"
          onclick={() => updateEquation(equation + '0')}
        />
        <TextButton
          text="."
          onclick={() => {
            if (!containDot(equation)) {
              updateEquation(equation + '.');
            }
          }}
        />
        <TextButton
          text="del"
          onclick={() => updateEquation(equation.slice(0, -1))}
        />
        <TextButton
          text="+"
          onclick={() => updateEquation(equation + '+')}
        />
        <ACButton
          text="AC"
          onclick={() => updateEquation('0')}
        />
        <EqualButton
          text="="
          onclick={() => calculate(equation)}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Calculator/>
      </header>
    </div>
  );
}

export default App;
