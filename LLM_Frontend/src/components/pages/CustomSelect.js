import { Select } from "antd";
import { useState } from "react";

export const CustomSelectProject = (props)=>{
    const {touched,error,value,handleChange,disabled,projects} = props;
    return (
        <>
            <div className="row d-flex align-items-center">  
            <label htmlFor="project_id" className="col-4" >Project Name</label>
            <div className='col-8'>
            <Select  
                name="project_id"  
                style={{ width: '100%'}}  
                value={value}  
                onChange={handleChange}  
                disabled={disabled}  
            >  
                <option value="">Select Project</option>    
                {projects && projects?.map((option) => (  
                    <option key={option?.project_id} value={option?.project_id}>  
                        {option?.project_name}  
                    </option>  
                ))}  
            </Select>  
            
            </div>
            </div>

            <div className='row'>
                <label className='col-4'></label>
                <div className='col-8'>
                <div className="error" style={{overflowX:"auto"}}>
                    {touched && error}
                </div>  
                </div>
            </div>
        </>
    )
}

export const CustomSelectFormType = (props)=>{
    const formTypes = ['File','Connection'];
    const {value, handleChange, touched, error} = props
    return(
        <>
        <div className="row my-3">
            <label htmlFor="form_type" className="col-4 col-form-label">Form Type</label>
            <div className="col-8">
                <Select
                name='form_type'
                value={value}
                onChange={handleChange}
                style={{width : '100%'}}
                >
                    <option value={''}>Select File Type</option>
                    {formTypes && formTypes?.map((formType)=>{
                        return <option key={formType} value={formType}>
                            {formType}
                        </option>
                    })}
                </Select>
                <div className="error" style={{overflowX : 'auto'}}>{touched && error}</div>
            </div>
        </div>
        </>
    )
}

export const CustomSelectFileType = (props)=>{
    const fileTypes = ['Excel', 'CSV'];
    const {value,handleChange,touched,error} = props
    return(
        <>
        <div className="row my-3">  
            <label htmlFor="file_type" className="col-4 col-form-label">File Type</label>  
            <div className="col-8">  
                <Select  
                    name="file_type"  
                    value={value}  
                    onChange={handleChange}  
                    style={{ width: '100%'}} 
                >  
                    <option value="">Select File Type</option>  
                    {fileTypes && fileTypes?.map((curType) => (  
                        <option key={curType} value={curType}>{curType}</option>  
                    ))}  
                </Select>  
                <div className="error" style={{overflowX:"auto"}}>{touched && error}</div>  
            </div>  
        </div>  
        </>
    )
}

export const CustomSelectSheet = (props)=>{
    const {value,handleChange,sheets,touched,error} = props
    return(
    <div className="row mb-3">  
            <label htmlFor="selected_sheet" className="col-4 col-form-label">Sheet</label>  
            <div className="col-8">  
                <Select  
                    name="selected_sheet"  
                    value={value}
                    style={{width:"100%"}}  
                    onChange={handleChange}  
                >  
                    <option value="">Select Sheet</option>  
                    {sheets && sheets?.map((sheet, index) => (  
                        <option key={index} value={sheet}>  
                            {sheet}  
                        </option>  
                    ))}  
                </Select>  
                <div className="error" style={{overflowX:"auto"}}>{touched && error}</div>  
            </div>  
        </div>
    )
}

export const CustomSelectManageProjects = (props)=>{
    const {value,handleChange,projects} = props
    return(
        <Select  
            name="project_id"   
            value={value}   
            style={{ minWidth:"200px", maxWidth:"250px", marginRight:"10px",textAlign:'center'}}   
            onChange={handleChange}   
        >  
            <option value={0} style={{ textAlign: "center" }}>Select Project</option>   
            {projects && projects?.map((option) => (  
                <option key={option?.project_id} value={option?.project_id} style={{ textAlign: "center" }}>{option?.project_name}</option>  
            ))}  
        </Select>
    )
}

export const CustomSelectProjectType = (props)=>{
    const {value,handleChange,touched,error} = props;
    return(
        <>
        <div className="row d-flex align-items-center mt-3">  
            <label htmlFor="project_id" className="col-4" >Project Type</label>
            <div className='col-8'>
                <Select  
            name="project_id"  
            style={{ width: '100%'}}  
            value={value}  
            onChange={handleChange}  
            disabled={false}  
            >  
            <option value="DMC">DMC</option>    
            <option value="SF">SF</option>    
            
            </Select> 
            </div>
        </div>       

            <div className='row'>
                <label className='col-4'></label>
                <div className='col-8'>
                <div className="error" style={{overflowX:"auto"}}>
                    {touched && error}
                </div>  
                </div>
            </div>              

        </>
    )
}


export const CustomSelectCheckbox = (props)=>{

    const {primaryKeys, handleChange} = props;

    return (
        <>
        <div className="row d-flex align-items-center mt-3">
            <label htmlFor="primary_keys" className="col-4">
                Scenarios
            </label>
            <div className="col-8">
                <Select
                name="primary_keys"
                placeholder="Please select"
                style={{width : "100%"}}
                mode="multiple"
                allowClear
                onChange={handleChange}
                >
                    {Object.entries(primaryKeys)?.map(([key,value]) =>
                        <option key={key} value={key + "&&_" + value}>{value}</option>
                    )}
                </Select>
            </div>
        </div>
        </>
    )
}