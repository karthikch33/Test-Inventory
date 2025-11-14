import { useFormik } from 'formik';
import React, { useEffect, useState  } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  Checkbox, Form, Input, Select, Splitter, Table, Tooltip } from 'antd';
import { Option } from 'antd/es/mentions';
import { FaDownload } from "react-icons/fa6";
import * as XLSX from 'xlsx';
import { EditableArea, EditableField, EditableSelectMappingType} from '../Bussiness Rules/EditableCell';
import { message } from 'antd';
import { getAllFilesByProjectIdSlice, getAllScenarioByFileIdSlice, getLatestVersionSlice, getScenarioTableSlice } from '../../features/WorkSpace/workSpaceSlice';
import Chat from './Chat';
import Meta from '../../utils/Meta'

const WorkSpace = () => {
    const { Search } = Input;
    const projects = useSelector(state => state.project.projects);
    const [allProjects,setAllProjects] = useState([]);
    const [tabledata,setTableData] = useState([]);
    const [loading,setLoading] = useState(false)
    const [rulesSearch,setRulesSearch] = useState(null);
    const [rules, setRules] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [fields,setFields] = useState([]);
    const [alertActive,setAlertActive] = useState(true);
    const [messageApi,contextHolder] = message?.useMessage();
    const [responseTableDataRows,setResponseTableDataRows] = useState([]);
    const [responseTableDataColumns,setResponseTableDataColumns] = useState([]);

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues:{
            files:'',
            scenarios:'',
            selected_project:'',
            selected_file : '',
            selected_scenario: '',
            current_project : '',
            current_file : '',
            scenario_description : ''
        },
    })

    useEffect(()=>{
        setAllProjects(projects);
    },[projects])
 
    // const columns = [
    //     {  
    //         title: 'Source Table',  
    //         dataIndex: 'source_table',  
    //         key: 'source_table',  
    //         render: (_,record) => (  
    //             <EditableField  
    //                 value={record?.source_table}  
    //                 disabled={true}
    //             />  
    //         )  
    //     },  
    //     {  
    //         title: 'Source Field Name',  
    //         dataIndex: 'source_field_name',  
    //         key: 'source_field_name', 
    //         width : 150, 
    //         render: (_, record) => (  
    //             <EditableField  
    //                 value={record?.source_field_name}  
    //                 disabled={true}
    //                 source='source_field_name'  
    //             />
    //         )  
    //     },  
    //     {  
    //         title: 'Mapping Type',  
    //         dataIndex: 'data_mapping_type',  
    //         key: 'data_mapping_type',   
    //         render: (_, record) => (  
    //             <EditableSelectMappingType handleChange={''}
    //                    value={record?.data_mapping_type} disabled={true}/> 
    //         )  
    //     },  
    //     {  
    //         title: 'Rules',  
    //         dataIndex: 'data_mapping_rules',  
    //         key: 'data_mapping_rules',  
    //         render: (_, record) => (  
    //             <EditableArea
    //                 value={record?.data_mapping_rules}
    //                 disabled={true}
    //             />
    //         )  
    //     },  
    //     {  
    //         title: 'Target SAP Table',  
    //         dataIndex: 'target_sap_table',  
    //         key: 'target_sap_table',  
    //     },  
    //     {  
    //         title: 'Target SAP Field',  
    //         dataIndex: 'target_sap_field',  
    //         key: 'target_sap_field',  
    //         width : 150,
    //         render : (_,record)=>(
    //             <Tooltip title={record?.target_sap_field } color={'black'} key={'white'} style={{color:"black"}}  placement="bottomRight">
    //             <label>{record?.isKey === "True"? <span style={{color:"red"}}> *{record?.target_sap_field }</span>: record?.target_sap_field}</label>
    //             </Tooltip>
    //         )
    //     },  
    //     {  
    //         title: 'Text Description',  
    //         dataIndex: 'text_description',  
    //         key: 'text_description', 
    //         width : 170,
    //         render : (_,record)=>(
    //             <Tooltip title={record?.text_description} color={'black'} key={'white'} style={{color : 'black'}} placement='bottomRight'>
    //                 <label>{record?.text_description}</label>
    //             </Tooltip>
    //         ) 
    //     },
    //     {
    //         title : 'LookUP',
    //         data : 'lookup',
    //         key : 'lookup',
    //         render : (_,record) =>(
    //              <Checkbox checked={record?.lookup} disabled={true}/>
    //         )
    //     } 
    // ]; 
 
    const handleProjectChange = (value) => {  
        formik.resetForm();
        setRules(null)
        formik.setFieldValue('selected_project', value);
        formik.setFieldValue('current_project',value);
        const data = {
          project_id : value,
      }
        dispatch(getAllFilesByProjectIdSlice(data))
        .then((response) => {  
          formik.setFieldValue('files', response?.payload?.data);
        })
    };
 
    const handleFileChange = (value) =>{
        formik.setFieldValue('selected_scenario', '');
        formik.setFieldValue('selected_file',value);
        formik.setFieldValue('current_file', value);
        formik.setFieldValue('scenarios',[]);
        setRules(null);
 
        const data = {
            project_id : formik.values.selected_project,
            file_id : value
        }

        dispatch(getAllScenarioByFileIdSlice(data))
        .then((response)=>{
            console.log(response)
            formik.setFieldValue('scenarios', response?.payload?.data);  
        })

    };

    const handleScenarioChange  = (value)=>{
        const scenario_obj = JSON.parse(value);

        formik.setFieldValue('selected_scenario', scenario_obj?.senerio_id);
        formik.setFieldValue('scenario_description',scenario_obj?.senerio_name);

        const data = {project_id:formik.values.selected_project,file_id:formik.values.selected_file,senario_id:scenario_obj?.senerio_id};

        dispatch(getScenarioTableSlice(data))
        .then((response)=>{
        if(response?.payload?.status === 200)
        {
            console.log(response);
            setTableData(response?.payload?.data?.rows)
            setFields(response?.payload?.data?.columns);
        }})
        .finally(()=>{
            setRules(null);
        })
    }

    const handleSearch = (e)=>{
        const updatedValues = rules;
        const filteredData = updatedValues && updatedValues.filter(item => (
            // item?.target_sap_field?.toLowerCase().includes(e.toLowerCase()) ||
            // item?.target_sap_table?.toLowerCase().includes(e.toLowerCase()) ||
            item?.text_description?.toLowerCase().includes(e.toLowerCase()) // uncommenting just to overriden the error
        ));
        setRulesSearch(filteredData)
    }

    const handleSearchChange = (e)=>{
        if(!e.target.value)
         setRulesSearch(rules)
    }

    const handleExcelSheet = ()=>{
        const worksheet = XLSX.utils.json_to_sheet(tabledata);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'table_data.xlsx');
    }

  return (
    <div className='w-100 px-2'>  
    <Meta title="WorkSpace"/>
    {contextHolder}
    <div className="options_header" style={{overflowX:'auto',marginTop:"-10px"}}> 

    <div style={{ flex: '0 0 3%', display: 'flex', justifyContent: 'space-between' }}>
    <Form.Item>
    <label style={{ color: "skyblue", fontSize: "20px",marginRight:"20px",marginLeft:"10px" }}>WorkSpace</label> 
    </Form.Item>
    </div>
    <div style={{ flex: '0 0 20%', display: 'flex', justifyContent: 'space-around'}}>
    <Form.Item label="Project" className="mb-0" style={{ minWidth: 200, maxWidth: 200}}> 
        <Select  
        style={{width:130}}
        onChange={handleProjectChange}  
        key={formik.values.current_project || undefined}  
        value={formik.values.current_project || undefined}  
        dropdownStyle={{  overflowY: 'auto' }}  
        >  
        {allProjects?.map((project) => (  
            <Option key={project?.project_id} value={project?.project_id}>  
            {project?.project_name}  
            </Option>  
        ))}  
        </Select>  
    </Form.Item>  

    <Form.Item label="File" className="mb-0" style={{ minWidth: 200, maxWidth: 200}}>
        <Select     
        style={{width:130}}
        key={formik.values.selected_file || undefined}  
        value={formik.values.current_file || undefined}  
        onChange={handleFileChange}  
        dropdownStyle={{ overflowY: 'auto' }}  
        >  
        {formik.values.files && formik.values.files?.map((object) => (  
            <Option key={object?.file_id} value={object?.file_id}>  
            {object?.file_name}  
            </Option>  
        ))}  
        </Select>  
    </Form.Item>  

    <Form.Item label="Scenario" className="mb-0" style={{ minWidth: 240, maxWidth: 240}}>
        <Select
        style={{width:160}}
        onChange={handleScenarioChange}  
        value={formik.values.scenario_description || undefined}  
        dropdownStyle={{ overflowY: 'auto' }}  
        >  
        {formik.values.scenarios && formik.values.scenarios?.map((segment) => (  
            <Option key={segment?.senerio_id} value={JSON.stringify(segment)}>  
            {segment?.senerio_name}  
            </Option>  
        ))}  
        </Select>  
    </Form.Item>  

    <Form.Item>
        <Input style={{ width: "200px", height: "30px" }} disabled value={formik.values.scenario_description}/>
    </Form.Item>

    </div>

    
    {/* <Form.Item>
        <Search placeholder="Search by Sap Table Sap Field" 
            onSearch={(e)=>handleSearch(e)}
            enterButton 
            onChange={(e)=>handleSearchChange(e)}
            style={{ minWidth:"280px", maxWidth:"280px", marginRight:"10px",marginBottom:"1px",maxHeight: "32px"}} 
            />
    </Form.Item>     */}

    
    </div>
    
    <div className="row" style={{ height: "73vh",overflow:"auto",marginTop:"-15px"}}>  
        <Splitter
        layout="horizontal"  
        lazy
        style={{ height: "100%", width:"100%",boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Splitter.Panel collapsible defaultSize="30%" min="10%" max="70%">  
          <Chat file_id={formik.values.selected_file}
          setResponseTableDataRows={setResponseTableDataRows} setResponseTableDataColumns={setResponseTableDataColumns} load={setLoading}/>
        </Splitter.Panel>    

<div className="col-12 col-md-9 d-flex flex-column h-100">  
        <Splitter  
            layout="vertical"  
            lazy
            style={{  
            flex: 1,
            height: 200,
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',  
            }}  
        >  
            <Splitter.Panel style={{flex: 1}} collapsible defaultSize="40%" min="10%" max="70%"> 

            <div className="table-container mb-3 flex-grow-1 scrollbar">  
            <Table  
                dataSource={tabledata || []}  
                className="WorkSpaceTargetTable"
                pagination={{ pageSize: 13, showQuickJumper: true, showSizeChanger: false}}  
                loading={loading}
                >  
                {fields?.map((i) => (  
                    <Table.Column  
                    title={i['value']}  
                    dataIndex={i['value']}  
                    key={i['value']}  
                    />  
                ))}  
                </Table> 
            </div>  
            </Splitter.Panel>  

            <Splitter.Panel style={{flex: 1}} collapsible>
            <div className="table-container2 flex-grow-1 rounded scrollbar">  
            <Table  
                dataSource={responseTableDataRows || []}  
                className="WorkSpaceTargetTable"
                pagination={{ pageSize: 13, showQuickJumper: true, showSizeChanger: false}}  
                loading={loading}
                >  
                {responseTableDataColumns?.map((i) => (  
                    <Table.Column  
                    title={i['value']}  
                    dataIndex={i['value']}  
                    key={i['value']}  
                    />  
                ))}  
                </Table> 
            </div>  
            </Splitter.Panel>  
        </Splitter>  
    </div>
      </Splitter> 
    </div>
  </div>  
  )
}

export default WorkSpace