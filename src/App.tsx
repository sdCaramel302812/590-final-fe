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

function Console(props: {text: string}) {
  return (
    <div className='Console'>
      {props.text}
    </div>
  );
}

function Calculator() {
  const [equation, setEquation] = useState('');

  function calculate(s: string) {
    let prev = 0;
    const stack = new Array<number | string>();
    let operator = '+';
    for (let i = 0; i <= s.length; i++) {
      if ( i === s.length || 
        s[i] === 'x' || s[i] === '/' || 
        s[i] === '+' || s[i] === '-' || 
        s[i] === '(' || s[i] === ')') {
        if (prev === i) {
          // error equation
          setEquation('ERR');
          return;
        }
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
            stack[back] = Number(stack[back]) * n;
            break;
          case '/':
            stack[back] = Number(stack[back]) / n;
            break;
        }
        if (i === s.length) {
          break;
        }
        operator = s[i];
      }
    }

    const result = stack.reduce((prev, curr) => Number(prev) + Number(curr));
    setEquation(String(result));
  }

  return (
    <div className='Calculator'>
      <Console
        text={equation}
      />
      <div className='ButtonGrid'>
        <TextButton
          text="AC"
          onclick={() => setEquation('')}
        />
        <TextButton
          text="("
          onclick={() => setEquation(equation + '(')}
        />
        <TextButton
          text=")"
          onclick={() => setEquation(equation + ')')}
        />
        <TextButton
          text="/"
          onclick={() => setEquation(equation + '/')}
        />
        <TextButton
          text="1"
          onclick={() => setEquation(equation + '1')}
        />
        <TextButton
          text="2"
          onclick={() => setEquation(equation + '2')}
        />
        <TextButton
          text="3"
          onclick={() => setEquation(equation + '3')}
        />
        <TextButton
          text="x"
          onclick={() => setEquation(equation + 'x')}
        />
        <TextButton
          text="4"
          onclick={() => setEquation(equation + '4')}
        />
        <TextButton
          text="5"
          onclick={() => setEquation(equation + '5')}
        />
        <TextButton
          text="6"
          onclick={() => setEquation(equation + '6')}
        />
        <TextButton
          text="-"
          onclick={() => setEquation(equation + '-')}
        />
        <TextButton
          text="7"
          onclick={() => setEquation(equation + '7')}
        />
        <TextButton
          text="8"
          onclick={() => setEquation(equation + '8')}
        />
        <TextButton
          text="9"
          onclick={() => setEquation(equation + '9')}
        />
        <TextButton
          text="+"
          onclick={() => setEquation(equation + '+')}
        />
        <TextButton
          text="0"
          onclick={() => setEquation(equation + '0')}
        />
        <TextButton
          text="."
          onclick={() => setEquation(equation + '.')}
        />
        <TextButton
          text="del"
          onclick={() => setEquation(equation.slice(0, -1))}
        />
        <TextButton
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
