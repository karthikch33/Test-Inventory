import { Form, Select, Input, Table, Tooltip, message, Button, Spin } from 'antd'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { getBussinessRulesSlice, getDataSegmentsSlice } from '../../features/BussinessRules/BussinessRulesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'antd/es/mentions'
import * as XLSX from 'xlsx';
import { FaDownload } from 'react-icons/fa6'
import Meta from '../../utils/Meta'
import { getAllFilesByProjectIdSlice, getPostLoadPivotSlice, getPostLoadReportSlice, getPreloadTableSlice, loadPreloadTablesSlice } from '../../features/WorkSpace/workSpaceSlice'
import FormItem from 'antd/es/form/FormItem'

const PostLoad_WorkSpace = () => {
    const {Search} = Input
    const projects = useSelector(state => state.project.projects);
    const [allProjects,setAllProjects] = useState([]);
    const [tablePartialData, setTablePartialData] = useState(); // recomment again after search enabled
    const [tableData,setTableData] = useState();
    const [fields ,setFields] = useState();
    const [messageApi,contextHolder] = message?.useMessage();
    const [loader,setLoader] = useState(false);

    const dispatch = useDispatch();
    
    useEffect(()=>{
        setAllProjects(projects);
    },[projects])

    const formik = useFormik({
            initialValues:{
                selected_project:'',
                current_project : '',
                selected_preload : '',
                selected_postload : '',
                preload_files : '',
                postload_files : ''
            },
    })

     const handleProjectChange = (value) => {  
            formik.resetForm();
            formik.setFieldValue('selected_project', value);
            formik.setFieldValue('current_project',value);
            const data = {
              project_id : value
          }
            dispatch(getAllFilesByProjectIdSlice(data))  // we are project id only but it is named has obj_id
            .then((response) => {  
                console.log(response);
              const filteredPreloadFiles = response?.payload?.data?.filter((item)=> item?.preload);
              const filteredSourceFiles  = response?.payload?.data?.filter((item)=> item?.postload);
              formik.setFieldValue('preload_files', filteredPreloadFiles);
              formik.setFieldValue('postload_files',filteredSourceFiles);
            })
    };

    const handlePreloadChange = (value)=>{
        formik?.setFieldValue('selected_preload',value);
    }

    const handlePostLoadChange = (value)=>{
        formik?.setFieldValue('selected_postload',value);
    }

    const handleSubmit = ()=>{
        if(!formik?.values?.selected_preload){
            alert('PreLoad File Must Be Selected');
            return;
        }

        if(!formik?.values?.selected_postload){
            alert('PostLoad File Must Be Selected');
            return;
        }


        const data = {
            project_id : formik?.values?.selected_project,
            preload_id : formik?.values?.selected_preload,
            postload_id : formik?.values?.selected_postload 
        }

        dispatch(getPostLoadPivotSlice(data))
        .then((response)=>{
            console.log(response)
            if(response?.payload?.status === 200){
                const payload = response?.payload?.data;
                setFields(payload?.columns) // columns
                setTableData(payload?.rows) // rows
            }
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
        // XLSX.writeFile(workbook, `${formik.values.selected_segment}_${filterStatus === undefined ? 'details' : filterStatus}.xlsx`);
    }

  return (
    <Spin spinning={loader} tip={'Loading...'}>
    <div>
        {contextHolder}
        <Meta title="WorkSpace"/>
        <div className="options_header" style={{overflowX:'auto',marginTop:"-10px"}}> 
        <Form.Item>
        <label style={{ color: "skyblue", fontSize: "20px",marginRight:"20px",marginLeft:"10px" }}>PostLoad Pivot</label> 
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


        <Form.Item label="PreLoad" className="mb-0" style={{ minWidth: 250, maxWidth: 250}}>
            <Select
            style={{width:160}}
            onChange={handlePreloadChange}  
            value={formik?.values?.selected_preload || undefined}  
            dropdownStyle={{ overflowY: 'auto' }}  
            >  
            {formik?.values?.preload_files && formik?.values?.preload_files?.map((preload_file) => (  
                <Option key={preload_file?.table_id} value={preload_file?.table_id}>  
                {preload_file?.file_name}  
                </Option>  
            ))}  
            </Select>  
        </Form.Item>  

        <Form.Item label="PostLoad" className="mb-0" style={{ minWidth: 250, maxWidth: 250}}>
            <Select
            style={{width:160}}
            onChange={handlePostLoadChange}  
            value={formik?.values?.selected_postload || undefined}  
            dropdownStyle={{ overflowY: 'auto' }}  
            >  
            {formik?.values?.postload_files && formik?.values?.postload_files?.map((postload_file) => (  
                <Option key={postload_file?.table_id} value={postload_file?.table_id}>  
                {postload_file?.file_name}  
                </Option>  
            ))}  
            </Select>  
        </Form.Item>  

        <FormItem>
            <Button onClick={handleSubmit}>Go</Button>
        </FormItem>

        {/* <Form.Item>
            <Tooltip title="Export Target Table" color={'black'} key={'black'}>
            <FaDownload style={{color:'blue',cursor:'pointer'}} onClick={handleExcelSheet}/>
            </Tooltip>
        </Form.Item> */}


        {/* <Form.Item>
         <Search placeholder="Search Here.."
            onSearch={handleSearch} 
            onChange={(e)=>handleSearchChange(e)}
            enterButton
            style={{width:"270px"}} /> 
        </Form.Item>  */}
        </div>

             <div className='row' style={{ height: "65vh",width:"100vw",marginTop:"10px",overflow : "auto"}}>
            <Table 
            className='Manage_Project'
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

export default PostLoad_WorkSpace