
class MyLib 
{

   toHex(input) 
   {
      if (typeof input === 'string')
      {        
         return input.charCodeAt(0);
      }
      else
      {
         if (input <= 9)
         {
            return [0, input];
         }
         else if (input > 9 && input % 16 >= 10)
         {
            let letters = {10:'A',11:'B',12:'C',13:'D',14:'E',15:'F'};
            if (input / 16 < 1)
            {
               return [0, letters[`${input % 16}`]];
            }
            else
            {
               let times = Math.floor(input/16);
               return [times,`${letters[`${input % 16}`]}`];
            }
          
          
         }
         else if (input >= 16 && input%16 < 10 )
         {
            let hx = [];
            while (input > 0)
            {
               let quotient = Math.floor(input / 16);
               let mod = input % 16;
               let hex = this.toHex(mod)[1];
               hx.unshift(hex)
               input = quotient;
            }
            return hx;
         }
      }
   }

   toBinary(ele)
   {
      let binary = [];
      while (ele)
      {
         if (ele % 2 === 0)
         {
            binary.unshift(0);
         } 
         else 
         {
            binary.unshift(1);
         }
         ele = Math.floor(ele/2);         
      }

      while (binary.length < 8)
      {
         binary.unshift(0);
      }
      return binary;
    }

   shuffle(rawArray)
   {
      let bits = {};        
      if (rawArray.length < 4)
      {
         let padding = 4 - rawArray.length;
         for (let i = 0; i < padding; i++)
         {
            let extra = new Array(8).fill(0);
            rawArray.push(extra);
         }
      }  
       
      rawArray = rawArray.reverse()
      for (let i = 0; i < rawArray.length; i++)
      {
         for (let j = 0; j < rawArray[i].length; j++)
         {
            if (bits[j] === undefined)
            {
               bits[j] = [rawArray[i][j]];
            }
            else
            {
               bits[j].push(rawArray[i][j]);
            }
         }
        
      }
     
      let decoded = [bits[0].concat(bits[1]),bits[2].concat(bits[3]),bits[4].concat(bits[5]),bits[6].concat(bits[7])];
      return decoded;
   
   }
   
   toDecimal(binary)
   {
      let total = [];
      if (binary.length === 4)
      {
         for (let i = 0; i < binary.length; i++)
         {
            let dec = 0;
            let currentBit = binary[i].reverse();
            for (let j = 0; j < currentBit.length; j++)
            {
               let num = currentBit[j];
               if (num === 1)
               {
                  let newNum = Math.pow(2, j);
                  dec += newNum;
               }
            }
               total.push(dec)
            }
      }
      else
      {     
         let dec = 0;
         for (let i = 0; i < binary.length; i++)
         {
            let num = binary[i];
            if (num === 1)
            {
               let newNum = Math.pow(2, i);
               dec += newNum;
            }
         }
         return dec;
      }
      return total;
   }

   encode(raw)
   {
      let binaryAll = [];
      raw = raw.split('');
      raw.forEach(ele => binaryAll.push(this.toBinary(this.toHex(ele))));
      let decimals = this.toDecimal(this.shuffle(binaryAll));
      let newHex = [];
      let letters = {'A':10,'B':11,'C':12,'D':13,'E':14,'F':15};
      decimals.forEach(ele => 
      {
         if (typeof this.toHex(ele)[0] === 'string' || typeof this.toHex(ele)[1] === 'string')
         {
            if (letters[this.toHex(ele)[1]] !== undefined)
            {
               newHex.push(this.toHex(ele)[0]);
               newHex.push(letters[this.toHex(ele)[1]]);
            }
            else
            {                
               newHex.push(letters[this.toHex(ele)[0]]);
               newHex.push(this.toHex(ele)[1]);    
            }             
         }
         else
         {
            if (typeof this.toHex(ele) === 'number')
            {               
               let digits = this.toHex(ele).toString().split('');
               digits.forEach(ele => newHex.push(parseInt(ele)));
            }
            else
            {
               var temp = newHex.concat(this.toHex(ele));
               newHex = temp; 
            }   
          }  
      }
      )        
      let newDec = 0;
      newHex.forEach((ele, i) =>
      {
         let temp = ele * Math.pow(16, ((newHex.length - 1) - i));
         newDec += temp;     
      }
      )
      return newDec;    
   }

   unShuffle(encodedArr)
   {
      let bits = {};
      let i = 0
      let count = 0;
      while (count < 32)
      {
         if (count % 4 === 0)
         {
            i ++;
         }
         
         if (bits[i] === undefined) {
            bits[i] = [encodedArr[count]];
         }
         else
         {
            bits[i].push(encodedArr[count]);
         }
         count++           
      }
      let newBinary = [];
      for (let i = 0; i < 4; i++)
      {
         let currentBinary =[];
         for (let j = 1; j < 9; j++)
         {
            let currentBit = bits[j][i];
            currentBinary.push(currentBit);
         }
         newBinary.push(currentBinary);
      }
      return newBinary.reverse();
   }

   decode(num) {
      let binary = this.toBinary(num)
      if (binary.length < 32)
      {
         let padding = 32 - binary.length;
         let extraArr = new Array(padding).fill(0);
         binary = extraArr.concat(binary);
      }     
      let binaryRaw = this.unShuffle(binary);
      let decimals = this.toDecimal(binaryRaw);
      let result = "";
      decimals.forEach(ele => result += String.fromCharCode(ele));
      return result;
   }
}

var artLogic = new MyLib()

const input = function(inp)
{
   if (typeof inp === 'string')
   {   
      let groups = [];
      for (let i = 0; i < inp.length; i+=4)
      {
         let newstr = inp.slice(i, i + 4);
         groups.push(newstr);
      }
      let result = [];
      groups.forEach(ele => result.push(artLogic.encode(ele)));
      return result
   }
   else
   { 
      let newstr = "";
      if (typeof inp === 'number')
      {
         return artLogic.decode(inp);
      }
      else if (typeof inp === 'object')
      {
         inp.forEach(ele => newstr += artLogic.decode(ele));
      } 
      return newstr;
    }
}