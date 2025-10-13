import { Form, Select, Input, Table, Tooltip, message, Button, Spin } from 'antd'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { getBussinessRulesSlice, getDataSegmentsSlice } from '../../features/BussinessRules/BussinessRulesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'antd/es/mentions'
import * as XLSX from 'xlsx';
import PieChart from './Pie_Chart'
import { FaDownload } from 'react-icons/fa6'
import Meta from '../../utils/Meta'
import { getErrorTableSlice, getPreloadTableSlice, getValidationTableSlice, loadPreloadTablesSlice } from '../../features/WorkSpace/workSpaceSlice'

const Validation_Workspace = () => {
    const {Search} = Input
    const projects = useSelector(state => state.project.projects);
    const [allProjects,setAllProjects] = useState([]);
    const [tablePartialData, setTablePartialData] = useState(); // recomment again after search enabled
    const [tableData,setTableData] = useState();
    const [fields ,setFields] = useState();
    const [messageApi,contextHolder] = message?.useMessage();
    const [loader,setLoader] = useState(false);
    const [filterStatus,setFilterStatus] = useState(undefined);
    const [passedRows,setPassedRows] = useState(0)
    const [totalRows,setTotalRows] = useState(0)
    const [failedRows,setFailedRows] = useState(0)

    const dispatch = useDispatch();
    
    useEffect(()=>{
        setAllProjects(projects);
    },[projects])

    const formik = useFormik({
            initialValues:{
                objects:'',
                segments:'',
                selected_project:'',
                selected_object : '',
                selected_segment: '',
                current_project : '',
                current_object : '',
                selected_status : ''
            },
    })

     const handleProjectChange = (value) => {  
            formik.resetForm();
            formik.setFieldValue('selected_project', value);
            formik.setFieldValue('current_project',value);
            const data = {
              obj_id : value,
              project_type : 'DMC' // any value can be passed here
          }
            dispatch(getBussinessRulesSlice(data))  // we are project id only but it is named has obj_id
            .then((response) => {  
              const filteredObjects = response?.payload?.data?.filter((item)=> item?.project_id === value);
              formik.setFieldValue('objects', filteredObjects);
            })
    };
     
    const handleObjectChange = (value) =>{
        formik.setFieldValue('selected_segment', '');
        formik.setFieldValue('selected_version', null);  
        formik.setFieldValue('current_version', '');
        formik.setFieldValue('selected_object',value);
        formik.setFieldValue('current_object', value);
        formik.setFieldValue('segments',[]);
        formik.setFieldValue('versions',[]);
    
        const data = {
            project_id : formik.values.selected_project,
            object_id : value
        }
        dispatch(getDataSegmentsSlice(data))
        .then((response)=>{
            formik.setFieldValue('segments', response?.payload?.data);  
        })
    };
    
    const handleSegmentChange  = (value)=>{
        formik.setFieldValue('selected_version',null);
        formik.setFieldValue('current_version', '');
        formik.setFieldValue('selected_segment', value);
        formik.setFieldValue('versions',[]);
        formik.setFieldValue('current_version','In Process');
        
        const data = {
            project_id : formik?.values?.selected_project,
            object_id : formik?.values?.selected_object,
            segment_id : value
        }

        dispatch(getValidationTableSlice(data))
        .then((response)=>{
            if(response?.payload?.status === 200){
                console.log(response?.payload?.data);
                setFields(response?.payload?.data?.rows)
                setTableData(response?.payload?.data?.columns)
                messageApi?.success('Validation Table Data Fetched Successfully');
            }
        })

    }

    const handleStatus = (value)=>{
        setLoader(true);
        setFilterStatus(value)
        const data = {
            segment_id : formik.values.selected_segment,
            filter : value
        }
        dispatch(getPreloadTableSlice(data))
        .then((response)=>{
            if(response?.payload?.status === 200)
            {
                setFields(response?.payload?.data?.data?.columns || [])
                setTableData(response?.payload?.data?.data?.rows || [])
                setTotalRows(response?.payload?.data?.full_numberof_rows || 0)
                setPassedRows(response?.payload?.data?.pass_numberof_rows || 0)
                setFailedRows(response?.payload?.data?.fail_numberof_rows || 0)
                messageApi?.success('Validation Table Data Fetched Successfully');
            }
            else if(response?.payload?.status === 202)
            {
                setTotalRows(response?.payload?.data?.full_numberof_rows || 0)
                setPassedRows(response?.payload?.data?.pass_numberof_rows || 0)
                setFailedRows(response?.payload?.data?.fail_numberof_rows || 0)
                messageApi?.warning(`Please load Preload Table First And Try To Access Again..`)
            }
        })
        .finally(()=>{
            setLoader(false);
        })
    }

    const handleSearch = (e)=>{
        const updatedValues =Array.isArray(tablePartialData) && tablePartialData?.filter((item) => {  
            const searchTerm = e?.toLowerCase();  
            return (  
                item?.table_name?.toLowerCase().includes(searchTerm) ||  
                item?.segment_name?.toLowerCase().includes(searchTerm)  
            );  
        })
        setTableData(updatedValues || [])
    }

    const handleSearchChange = (e)=>{
        if(!e?.target?.value){
            setTableData(tablePartialData);
        }
    }

    const handleExcelSheet = ()=>{
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${formik.values.selected_segment}_${filterStatus === undefined ? 'details' : filterStatus}.xlsx`);
    }

    const loadPreloadTable = ()=>{
        setLoader(true);
        const data = {
            segment_id : formik.values.selected_segment
        }
        dispatch(loadPreloadTablesSlice(data))
        .then((response)=>{
            if(response?.payload?.status === 200)
            messageApi?.success('Preload Table Updated Successfully..')
        })
        .finally(()=>{
            setLoader(false);
        })
    }

  return (
    <Spin spinning={loader} tip={'Loading...'}>
    <div>
        {contextHolder}
        <Meta title="WorkSpace"/>
        <div className="options_header" style={{overflowX:'auto',marginTop:"-10px"}}> 
        <Form.Item>
        <label style={{ color: "skyblue", fontSize: "20px",marginRight:"20px",marginLeft:"10px" }}>WorkSpace</label> 
        </Form.Item>
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

        <Form.Item label="Object" className="mb-0" style={{ minWidth: 200, maxWidth: 200}}>
            <Select     
            style={{width:130}}
            key={formik.values.selected_object || undefined}  
            value={formik.values.current_object || undefined}  
            onChange={handleObjectChange}  
            dropdownStyle={{ overflowY: 'auto' }}  
            >  
            {formik.values.objects && formik.values.objects?.map((object) => (  
                <Option key={object?.obj_id} value={object?.obj_id}>  
                {object?.obj_name}  
                </Option>  
            ))}  
            </Select>  
        </Form.Item>  

        <Form.Item label="Segment" className="mb-0" style={{ minWidth: 250, maxWidth: 250}}>
            <Select
            style={{width:160}}
            onChange={handleSegmentChange}  
            value={formik.values.selected_segment || undefined}  
            dropdownStyle={{ overflowY: 'auto' }}  
            >  
            {formik.values.segments && formik.values.segments?.map((segment) => (  
                <Option key={segment?.segment_id} value={segment?.segment_id}>  
                {segment?.segement_name}  
                </Option>  
            ))}  
            </Select>  
        </Form.Item>  


        <Form.Item>
            <Tooltip title="Export Target Table" color={'black'} key={'black'}>
            <FaDownload style={{color:'blue',cursor:'pointer'}} onClick={handleExcelSheet}/>
            </Tooltip>
        </Form.Item>

       {/* {formik.values.selected_segment && <Form.Item label="Fitler" className="mb-0" style={{ minWidth: 160, maxWidth: 160}}>
            <Select
            style={{width:100}}
            onChange={handleStatus}  
            value={formik.values.selected_status || undefined}  
            dropdownStyle={{ overflowY: 'auto' }}  
            >  
             <Option value='PASS' key='pass'>PASS</Option>
             <Option value='FAIL' key='fail'>FAIL</Option>
             <Option value='FULL' key='full'>FULL</Option>
            </Select>  
        </Form.Item>
        } */}

        {/* <Form.Item>
        <Tooltip title="Update Preload Tables" color={'black'} key={'black'}>
            <Button onClick={loadPreloadTable} style={{marginRight : "10px"}}>
            Load
            </Button>
        </Tooltip>
        </Form.Item>

        <Form.Item style={{marginRight:"20px"}}>
            <Tooltip title="Preload Report" color={'black'} key={'black'}>
            <FaDownload style={{color:'blue',cursor:'pointer'}} onClick={handleExcelSheet}/>
            </Tooltip>
        </Form.Item>

        <Form.Item>
         <Search placeholder="Search Here.."
            onSearch={handleSearch} 
            onChange={(e)=>handleSearchChange(e)}
            enterButton
            style={{width:"270px"}} /> 
        </Form.Item>   */}
        </div>
             <div className='row' style={{ height: "65vh",width:"100vw",marginTop:"10px",overflow : "auto"}}>
            <Table 
            className='PreLoad_Table'
            dataSource={tableData}
            loading={loader}
            pagination = {
            {
                pageSize : 10,
                pageSizeOptions:[],
                showQuickJumper:true,
                showSizeChanger:false,
                position : ['bottomLeft']
            }
            }
            >
                {
                    fields?.map((field)=>(
                        <Table.Column
                         title={field?.value?.toUpperCase()}
                         dataIndex={field?.value}
                         key={field?.value}
                        />
                    ))
                }
            </Table>
        </div>
        </div>
        </Spin>
  )
}

export default Validation_Workspace