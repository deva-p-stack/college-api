import './style.css'
let search = document.getElementById('search');
let state = document.getElementById('state');
let con = document.getElementById('con');
const BASE_API_KEY = 'https://indian-colleges-list.vercel.app/api';
async function getState() {
  try {
    const response = await fetch(`${BASE_API_KEY}/institutions/states`);

    if (!response.ok) {
      throw new Error('Network response was not working');
    }

    const data = await response.json();
    data.states.forEach((item) => {
        let option = document.createElement('option');
        option.textContent = `${item.name}`;
        option.value = item.name;
        
        state.append(option);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getState();

async function getSearchByState(stateName) {
  try {
   
    const STATE_API_KEY = `https://indian-colleges-list.vercel.app/api/institutions/states/${stateName}`;

    
    const response = await fetch(STATE_API_KEY);

    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    
    const data = await response.json();

    // console.log(data);
    // console.log(typeof data);

const colleges = data.data;  
colleges.forEach(college => {
  console.log(college);

 


let result = '';

colleges.forEach(college => {
  result += `
    <div class="bg-blue-300 w-full sm:w-[350px] min-h-[300px] rounded-lg shadow-lg p-5 flex flex-col justify-between border border-white/20">
      <h3 class="font-semibold text-lg text-center ">
        ${college.institute_name}
      </h3>
      <p>Address: <span>${college.address}</span></p>
      <p>District: <span>${college.district}</span></p>
      <p>Institutes Type: <span>${college.institution_type}</span></p>
      <!-- button div  -->
      <div class="flex justify-end ">
      <button class="cursor-pointer active:scale-95 bg-white/50 text-md px-3 py-2 rounded">View course</button>
    </div>
    
  </div>
  `;
});

con.innerHTML = result;






});



} catch (error) {
    console.error('Error fetching data:', error);
  }
}





// state value passing to the search input fields
state.addEventListener('change', function () {   
    // search.value = state.value;
    getSearchByState(state.value);
})

// To search the state using the dropdown value 








// 
search.addEventListener('input',function(){
   

    getSearchByState();
    
})













