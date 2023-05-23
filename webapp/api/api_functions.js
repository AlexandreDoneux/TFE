// File containing different functions used in different routes or API files

function createNewObject(okPacket) {
    const newObj = {};
    for (let [key, value] of Object.entries(okPacket)) {
      // If the value is a BigInt, transform to string
      // Trnasform also integers and floats ?
      if(typeof value === 'bigint'){
        value=value.toString()
      }
      newObj[key] = value;
    }
    return newObj;
}
  
  
function transformDate(date_to_transform, compare_date){
    /**
     * Receives a date as a tuple and creates a new date tuple of the first date based on the current date retrieved by the system. The idea is to 
     * reposition the date received inside the system's date "frame". Figuring the time translation between compare_date and the current time to apply 
     * its translation to dtae_to_transform.
     */
    const current_date = new Date().toLocaleString('en-US', { timeZone: 'Europe/Brussels', hour12: false });
    const date_components = current_date.split(/[\/,: ]+/).map(component => parseInt(component));
    const [month, day, year, hour, minute, second] = date_components;
    const current_date_tuple = [year, month, day, hour, minute, second];
  
    // calculate difference in time between the send date and real date
    const time_translation = current_date_tuple.map((elem, index) => elem - compare_date[index]);
  
    // adding the time translation (between send date and real date) to the date to be transformed
    const transformed_date = date_to_transform.map((elem, index) => elem + time_translation[index]);
  
    return transformed_date
}




module.exports = { createNewObject, transformDate  };