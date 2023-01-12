import DocumentPicker from "react-native-document-picker"

const SelectDocument = async (setDocument) => {
   
    

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      })
    //   console.log(
    //     res[0].uri,
    //     res[0].type, // mime type
    //     res[0].name,
    //     res[0].size
    //   )
    //   console.log('URI')
    //   console.log(res)
    //   const name = decodeURIComponent(res[0].uri)
        
      return setDocument(res)
    } catch (err) {}
}
export default SelectDocument