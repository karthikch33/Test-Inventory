import { useFormik } from 'formik';
import React, { useEffect, useState  } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getBussinessRulesSlice, getDataSegmentsSlice, getFieldsOnSegmentSlice, getTableSlice, getVersionNumberSlice } from '../../features/BussinessRules/BussinessRulesSlice';
import {  Checkbox, Form, Input, Select, Splitter, Table, Tooltip } from 'antd';
import { Option } from 'antd/es/mentions';
import { FaDownload } from "react-icons/fa6";
import * as XLSX from 'xlsx';
import { EditableArea, EditableField, EditableSelectMappingType} from '../Bussiness Rules/EditableCell';
import { message } from 'antd';
import { getLatestVersionSlice } from '../../features/WorkSpace/workSpaceSlice';
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
        // dispatch(getBussinessRulesSlice(data))  // we are project id only but it is named has obj_id
        // .then((response) => {  
        //   const filteredFiles = response?.payload?.data?.filter((item)=> item?.project_id === value);
        //   formik.setFieldValue('files', filteredFiles);
        // })
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

        // dispatch(getDataSegmentsSlice(data))
        // .then((response)=>{
        //     formik.setFieldValue('scenarios', response?.payload?.data);  
        // })
    };

    const handleScenarioChange  = (value)=>{
        formik.setFieldValue('selected_scenario', value);
        formik.setFieldValue('scenario_description',value);

        const data = {project_id:formik.values.selected_project,file_id:formik.values.selected_file,scenario_id:value};

        // dispatch(getFieldsOnSegmentSlice())
        // .then((response)=>{
        // if(response?.payload?.status === 200)
        //     {
        //     setFields(response?.payload?.data);
        // }})
        // .finally(()=>{
        //     setRules(null);
        // })
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
            <Option key={object?.obj_id} value={object?.obj_id}>  
            {object?.obj_name}  
            </Option>  
        ))}  
        </Select>  
    </Form.Item>  

    <Form.Item label="Scenario" className="mb-0" style={{ minWidth: 240, maxWidth: 240}}>
        <Select
        style={{width:160}}
        onChange={handleScenarioChange}  
        value={formik.values.selected_scenario || undefined}  
        dropdownStyle={{ overflowY: 'auto' }}  
        >  
        {formik.values.scenarios && formik.values.scenarios?.map((segment) => (  
            <Option key={segment?.segment_id} value={segment?.segment_id}>  
            {segment?.segement_name}  
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
          <Chat project_id={formik.values.selected_project} object_id={formik.values.selected_file} segment_id={formik.values.selected_scenario}
          setTableData={setTableData} load={setLoading}/>
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
            <Splitter.Panel style={{flex: 1}} collapsible>
            <div className="table-container2 flex-grow-1 rounded scrollbar">  
                <Table  
                dataSource={tabledata || []}  
                className="WorkSpaceTargetTable"
                pagination={{ pageSize: 13, showQuickJumper: true, showSizeChanger: false}}  
                loading={loading}
                >  
                {fields?.map((i) => (  
                    <Table.Column  
                    title={i['fields']}  
                    dataIndex={i['fields']}  
                    key={i['fields']}  
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