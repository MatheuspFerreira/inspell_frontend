import './button.css';



export function Button ({text, click}) {
    return (
        <div className='Button__container'>
            <button onClick={click}>{text}</button>
        </div>
    );
};