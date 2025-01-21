

export const encodeBase64 = (data) => {
  return Buffer.from(data).toString('base64');
}

export const decodeBase64 = (data) => {
  return Buffer.from(data, 'base64').toString('utf-8');
}
export const stringHashCode = (data) => {
  var hash = 0;//ww  w  . j av a2 s  .  c o m
  if (data.length == 0) return hash;
  for (var i = 0; i < data.length; i++) {
    let chr = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}


export const getArrFirstData = (arr)=> {
  if(arr instanceof Array) {
    if(typeof (arr) != 'undefined' && arr.length > 0) {
      return arr[0];
    }else{
      return '';
    }
  }else{
    return arr;
  }
}
