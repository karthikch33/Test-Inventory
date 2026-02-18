import { Input } from 'antd'
import React from 'react'

const CustomInput = (props) => {
    const {label,type,name,value,handleChange,blur,disabled,touched,error,placeholder} = props
  return (
   <>
  
        <label htmlFor="connection_name" className='col-12 form-label'>{label}</label> 

        <Input
            type={type}
            name={name} 
            value={value}  
            onChange={handleChange}
            placeholder={placeholder}
            onBlur={blur}
            disabled={disabled}   
        />   

    <div className='row'>
        <div className='col-12'>
        <div className="error" style={{overflowX:"auto"}}>
            {touched && error}
        </div>  
        </div>
    </div>
   </>
  )
}


export default CustomInput