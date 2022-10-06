import React from 'react'
import { Endpoint } from '../environment/Api'
import http from './http'

const DataList = () => {

    const [profession,setProfession]= useState()
    const [departaments,setDepartaments]= useState()
    const [cities,setCities]= useState()
    const [dniTypes,setDniTypes]= useState()
    const [eps,setEps]= useState()

    useEffect(() => {
        getDniTypes()
        getProfessions()
        getDepartaments()
        getEps()
    }, [])

    const getProfessions = async()=>{
        try {
          const res = await http('get',Endpoint.professions)
          setProfession(res)
        } catch (error) {
          console.log('error',error)
        }
    }
  
    const getDepartaments = async()=>{
        try {
          const res = await http('get',Endpoint.departaments)
          setDepartaments(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getDniTypes = async()=>{
        try {
          const res = await http('get',Endpoint.dniTypes)
          setDniTypes(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getEps = async()=>{
        try {
          const res = await http('get',Endpoint.eps)
          setEps(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getCities = async()=>{
        console.log('dep',userRegister.state)
        try {
          const res = await http('get',Endpoint.cities(userRegister.state))
          console.log('cities',res)
          setCities(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    return {profession,departaments,eps,cities,}


}
export default DataList