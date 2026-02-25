import "./style.css";

document.addEventListener("DOMContentLoaded", async function () {
  // element var
  const districtEl = document.getElementById("district");
  const searchInputEL = document.getElementById("search");
  // const searchBtnEl = document.getElementById("search-btn");
  const stateEl = document.getElementById("state");
  const containerEl = document.getElementById("con");
  const institutionTypeEl = document.getElementById("institution");
  const UniversityEl = document.getElementById("University");
  const programmeEl = document.getElementById("programme");
  const courseDialogEL = document.getElementById("course-info");
  const courseTableEl = document.getElementById("course-table");
  const courseDialogCloseBtnEL = document.getElementById(
    "course-dialog-close-btn",
  );
  const loadingAlertEL = document.getElementById("loading-alert");
  const searchAlertEl = document.getElementById("search-alert");
  const filterDivEl = document.getElementById("filter-div");
  const filteredCardCount = document.getElementById("card-count");
  const filterStatusEl = document.getElementById("filter-status");
  const restBtnEl = document.getElementById("reset-btn");

    const icon = document.getElementById("clear");
  
 icon.addEventListener("click", function () {
  icon.classList.toggle("rotate-180");
  containerEl.innerHTML = '';
  
});

  restBtnEl.addEventListener("click", () => {
    filteredStateArr = [];
    filteredDistrictArr = [];
    filteredInstituteArr = [];
    filteredUniversityArr = [];
    filteredProgrammeArr = [];

    renderFn([], false, true);
  });

  // data var
  const BASE_API_KEY = "https://indian-colleges-list.vercel.app/api";
  // let collageDataArr = [];
  const allStateArr = await getState();

  // filtered
  let filteredStateArr = [];
  let filteredDistrictArr = [];
  let filteredInstituteArr = [];
  let filteredUniversityArr = [];
  let filteredProgrammeArr = [];

  getState();
  setStatesInOption(allStateArr);

  courseDialogCloseBtnEL.addEventListener("click", () =>
    courseDialogEL.close(),
  );

  // append the state value in a state dropdown values
  async function getState() {
    try {
      const response = await fetch(`${BASE_API_KEY}/institutions/states`);

      if (!response.ok) {
        throw new Error("Network response was not working");
      }

      const data = await response.json();

      return data.states;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // dropdown--1-set
  // set state options to the state dropdown menu
  function setStatesInOption(stateArr) {
    stateArr.forEach((item) => {
      const option = document.createElement("option");
      option.textContent = `${item.name}`;
      option.value = item.name;
      option.className = "text-[#E2E8F0] border-[#2E3A47] bg-[#202934]";

      stateEl.append(option);
    });
  }

  // search the state name and append the district value
  async function getSearchByState(stateName) {
    try {
      const STATE_API_KEY = `https://indian-colleges-list.vercel.app/api/institutions/states/${stateName}`;

      const response = await fetch(STATE_API_KEY);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const collageDataArr = data.data;
      filteredStateArr = collageDataArr.sort((a, b) =>
        a.institute_name.trim().localeCompare(b.institute_name.trim()),
      );

      renderFn(filteredStateArr);

      // dropdown--2-set
      // this clear inside content of the district tag prevent previous values
      districtEl.innerHTML = "";
      // unique district name using the set method remove the duplicates
      const uniqueDistricts = [
        ...new Set(filteredStateArr.map((item) => item.district)),
      ].sort();

      // district name add to the drop down list
      addDropdownValues(uniqueDistricts, districtEl);

      // All option add in dropdown in district
      addAllOptionInDropdown("Districts", districtEl);

      // dropdown--2.5-set
      // this clear inside content of the Institution tag prevent previous values
      institutionTypeEl.innerHTML = "";
      // unique institution name using the set method remove the duplicates
      const uniqueInstitutions = [
        ...new Set(filteredStateArr.map((item) => item.institution_type)),
      ].sort();

      // district name add to the drop down list
      addDropdownValues(uniqueInstitutions, institutionTypeEl);

      // All option add in dropdown in district
      addAllOptionInDropdown("Institution", institutionTypeEl);

      // dropdown--3-set
      // this clear inside the content of the university tag prevent previous values
      UniversityEl.innerHTML = "";
      // unique university name using set method to remove the duplicates
      const uniqueUniversity = [
        ...new Set(filteredStateArr.map((item) => item.university)),
      ].sort();

      const valuesToRemove = ["NOT APPLICABLE", "NONE", "None", "Self", "SELF"];

      const finalValues = uniqueUniversity.filter(
        (item) => !valuesToRemove.includes(item),
      );

      // add university Dropdown values
      addDropdownValues(finalValues, UniversityEl);

      // All option add in dropdown in programme type
      addAllOptionInDropdown("Universities", UniversityEl);

      // dropdown--4-set
      // programme drop add
      programmeEl.innerHTML = "";

      const uniqueProgrammes = [
        ...new Set(
          filteredStateArr.flatMap((item) =>
            item.programmes.map((p) => p.programme),
          ),
        ),
      ].sort();

      // add dropdown values for programme dropdown
      addDropdownValues(uniqueProgrammes, programmeEl);

      // All option add in dropdown in programme type
      addAllOptionInDropdown("Programmes", programmeEl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // add dropdown values by array
  function addDropdownValues(arr, dropdown) {
    arr.forEach((val) => {
      const option = document.createElement("option");
      option.className = "text-[#E2E8F0] border-[#2E3A47] bg-[#202934]";
      option.textContent = val;
      option.value = val;
      dropdown.append(option);
    });
  }

  // add all option option on top of dropdown.
  function addAllOptionInDropdown(optionName, dropdownEL) {
    const allOptionEl = document.createElement("option");
    allOptionEl.textContent = `All ${optionName}`;
    allOptionEl.value = "All";
    allOptionEl.className = "text-[#E2E8F0] border-[#2E3A47] bg-[#202934];";
    allOptionEl.selected = true;
    dropdownEL.prepend(allOptionEl);
  }

  // result output div
  function renderFn(collageData, searchName = false, reset = false) {
    // if no data available trigger below if
    {
      if (
        collageData.length === 0 ||
        collageData === "" ||
        collageData === null ||
        collageData === undefined
      ) {
        if (reset) {
          containerEl.innerHTML = `<div class="col-span-full text-white mt-5 md:mt-20">
        <p class="text-blue-100 text-center">Previous searches are cleared now you can search again 🔄️...</p>
       </div>`;
          // add filter el
          filterDivEl.classList.replace("flex", "hidden");

          searchInputEL.value = "";

          // other options reset
          districtEl.innerHTML = "";
          addAllOptionInDropdown("District", districtEl);
          institutionTypeEl.innerHTML = "";
          addAllOptionInDropdown("Institution", institutionTypeEl);
          UniversityEl.innerHTML = "";
          addAllOptionInDropdown("University", UniversityEl);
          programmeEl.innerHTML = "";
          addAllOptionInDropdown("Programme", programmeEl);
          return;
        } else {
          containerEl.innerHTML = `<div class="col-span-full text-white mt-5 md:mt-20">
        <p class="text-blue-100 text-center">No Data found</p>
       </div>`;
          // add filter el
          filterDivEl.classList.replace("flex", "hidden");
          return;
        }
      }
    }

    // remove search alert el
    searchAlertEl.classList.add("hidden");
    // add filter el
    filterDivEl.classList.replace("hidden", "flex");
    filteredCardCount.textContent = collageData.length;
    filterStatusEl.innerHTML = "";

    if (!searchName) {
      // state
      filterStatusEl.innerHTML += `<strong>Filtered by:</strong> ${stateEl.value} (State)`;
      // dist
      if (
        districtEl.value !== "District" &&
        districtEl.value !== "" &&
        districtEl.value !== "All"
      ) {
        filterStatusEl.innerHTML += `, ${districtEl.value} (District)`;
      }
      // institute
      if (
        institutionTypeEl.value !== "Institution" &&
        institutionTypeEl.value !== "" &&
        institutionTypeEl.value !== "All"
      ) {
        filterStatusEl.innerHTML += `, ${institutionTypeEl.value} (Institution),<br>`;
      }
      // university
      if (
        UniversityEl.value !== "University" &&
        UniversityEl.value !== "" &&
        UniversityEl.value !== "All"
      ) {
        filterStatusEl.innerHTML += `${UniversityEl.value} (University), <br>`;
      }

      // programme
      if (
        programmeEl.value !== "Programme" &&
        programmeEl.value !== "" &&
        programmeEl.value !== "All"
      ) {
        filterStatusEl.innerHTML += `${programmeEl.value} (Programme)`;
      }
    } else {
      //Name filter status
      filterStatusEl.innerHTML = `<strong>Filtered by:</strong> ${searchInputEL.value} (Collage Name)`;
    }

    // create card fn
    const fragment = document.createDocumentFragment();
    fragment.replaceChildren();
    containerEl.innerHTML = "";

    collageData.forEach((collage) => {
      const cardEl = document.createElement("div");
      cardEl.className =
        "bg-[#0F1C2B] w-full sm:w-87.5 min-h-50 hover:shadow-2xl transform transition-all ease-in-out hover:-translate-y-1 duration-300 ease-in-out  space-y-2 shadow-lg rounded-lg shadow-lg p-5 pb-10 flex flex-col content-center border border-white/20 relative";

      function toTitleCase(text) {
        return text
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      const divcollageNameEl = document.createElement("div");
      divcollageNameEl.className =
        "flex items-center justify-center w-full gap-2  ";

      const collageNameEl = document.createElement("h3");
      collageNameEl.className =
        "w-full cursor-pointer  font-semibold text-lg flex items-center gap-2 text-slate-200";
      collageNameEl.innerHTML = `<svg  class="w-5 h-5 shrink-0  "   xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><!-- Icon from Huge Icons by Hugeicons - undefined --><g fill="none" stroke="currentColor" stroke-linecap="round"><path stroke-linejoin="round" stroke-width="1.5" d="M7 22v-9.602c0-1.068 0-1.602.245-2.05c.244-.448.693-.737 1.592-1.315l2.082-1.338c.525-.337.787-.506 1.081-.506s.556.169 1.082.506l2.081 1.338c.899.578 1.348.867 1.592 1.315c.245.448.245.982.245 2.05V22"/><path stroke-linejoin="round" stroke-width="2" d="M12 13h.009"/><path stroke-linejoin="round" stroke-width="1.5" d="M21 22v-5.838c0-2.291-1.26-2.477-4-3.162M3 22v-5.838C3 13.871 4.26 13.685 7 13m-5 9h20"/><path stroke-width="1.5" d="M12 22v-4"/><path stroke-linejoin="round" stroke-width="1.5" d="M12 7V4.982m0 0V2.97c0-.474 0-.711.146-.858c.46-.463 2.354.631 3.074 1.075c.608.374.78 1.122.78 1.795z"/></g></svg>
      ${toTitleCase(collage.institute_name)}`;

      let isCopyed = false;
      collageNameEl.addEventListener("click", () => {
        const textToCopy = toTitleCase(collage.institute_name);

        if (isCopyed) return;
        isCopyed = true;

        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            // create span
            const successIcon = document.createElement("div");

            successIcon.className = "ml-2 flex items-center gap-2";
            successIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z"/></svg>  `;
            successIcon.className = "ml-2 ";

            collageNameEl.appendChild(successIcon);

            // remove few second
            setTimeout(() => {
              successIcon.remove();
              isCopyed = false;
            }, 3000);
          })
          .catch((err) => {
            console.error("Copy failed: ", err);
          });
      });
      divcollageNameEl.append(collageNameEl);

      const universityEl2 = document.createElement("p");
      universityEl2.className = "text-slate-100 pt-2 flex items-start gap-2";
      universityEl2.innerHTML = `<svg class="w-5 h-5 shrink-0 "  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><!-- Icon from Basil by Craftwork - https://creativecommons.org/licenses/by/4.0/ --><path fill="currentColor" fill-rule="evenodd" d="M11.612 3.302c.243-.07.5-.07.743 0c.518.147 1.04.283 1.564.42c2.461.641 4.96 1.293 7.184 3.104l1.024.834c.415.338.623.84.623 1.34v7a.75.75 0 0 1-1.5 0v-4.943l-.163.133a12 12 0 0 1-2.398 1.513q.06.137.061.297v4.294a2.75 2.75 0 0 1-1.751 2.562l-4 1.56a2.75 2.75 0 0 1-1.998 0l-4-1.56a2.75 2.75 0 0 1-1.751-2.562V13q.001-.163.064-.304c-.83-.399-1.64-.89-2.417-1.522l-1.024-.834c-.83-.677-.83-2.003 0-2.68l1.04-.85c2.207-1.8 4.689-2.449 7.132-3.087a74 74 0 0 0 1.567-.421m9.638 5.699c0-.09-.036-.15-.07-.178l-1.024-.834C18 6.5 16.078 5.843 13.64 5.202a91 91 0 0 1-1.656-.446c-.57.161-1.124.307-1.662.449c-2.42.636-4.529 1.191-6.46 2.768l-1.041.849c-.035.028-.071.087-.071.177s.036.15.07.178l1.025.834c1.948 1.587 4.076 2.146 6.515 2.787q.805.208 1.656.446c.57-.161 1.124-.307 1.662-.449c2.42-.636 4.529-1.191 6.46-2.767l1.041-.85c.035-.028.071-.087.071-.177m-7.294 5.276c1.1-.287 2.207-.577 3.294-.972v3.989c0 .515-.316.977-.796 1.165l-4 1.559a1.25 1.25 0 0 1-.908 0l-4-1.56a1.25 1.25 0 0 1-.796-1.164v-3.998c1.099.4 2.219.692 3.33.982c.525.137 1.047.273 1.565.42c.243.07.5.07.743 0c.519-.148 1.042-.284 1.568-.421" clip-rule="evenodd"/></svg> 
      <span class="cursor-pointer font-semibold text-sky-400/80">${toTitleCase(collage.university)}</span>`;

      let isCopy = false;
      universityEl2.addEventListener("click", () => {
        const textToCopy = toTitleCase(collage.university);

        if (isCopy) return;
        isCopy = true;

        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            // create span
            const successIcon = document.createElement("div");

            successIcon.className = "ml-2 flex items-center gap-2";
            successIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z"/></svg>  `;
            successIcon.className = "ml-2 ";

            universityEl2.appendChild(successIcon);

            // remove few second
            setTimeout(() => {
              successIcon.remove();
              isCopy = false;
            }, 3000);
          })
          .catch((err) => {
            console.error("Copy failed: ", err);
          });
      });

      // ${collage.institution_type}

      const institutionTypeEL = document.createElement("p");
      institutionTypeEL.innerHTML = `<svg class="w-5 h-5 shrink-0 mt-1 items-start"  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 640 640"><!-- Icon from Font Awesome Solid by Dave Gandy - https://creativecommons.org/licenses/by/4.0/ --><path fill="currentColor" d="M335.9 84.2c-9.8-5.6-21.9-5.6-31.8 0l-224 128c-12.6 7.2-18.8 22-15.1 36S81.5 272 96 272h32v208l-51.2 38.4c-8.1 6-12.8 15.5-12.8 25.6c0 17.7 14.3 32 32 32h448c17.7 0 32-14.3 32-32c0-10.1-4.7-19.6-12.8-25.6L512 480V272h32c14.5 0 27.2-9.8 30.9-23.8s-2.5-28.8-15.1-36l-224-128zM464 272v208h-64V272zm-112 0v208h-64V272zm-112 0v208h-64V272zm80-112c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32"/></svg>
      <span class="cursor-pointer font-semibold text-sky-400/80">${toTitleCase(collage.institution_type)}</span>`;
      institutionTypeEL.className = "text-slate-100 pt-2 flex  gap-2";

      let Copy = false;
      institutionTypeEL.addEventListener("click", () => {
        const textToCopy = toTitleCase(collage.institution_type);

        if (Copy) return;
        Copy = true;

        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            // create span
            const successIcon = document.createElement("div");

            successIcon.className = "ml-2 flex items-center gap-2";
            successIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z"/></svg>  `;
            successIcon.className = "ml-2 ";

            institutionTypeEL.appendChild(successIcon);

            // remove few second
            setTimeout(() => {
              successIcon.remove();
              Copy = false;
            }, 3000);
          })
          .catch((err) => {
            console.error("Copy failed: ", err);
          });
      });

      // const stateEl = document.createElement("p");
      // stateEl.innerHTML = `State: <span class="font-semibold text-sky-400/80">${toTitleCase(collage.state)}</span>`;
      // stateEl.className = "pt-2 text-slate-100";

      // district

      const divdistrictEl = document.createElement("div");
      divdistrictEl.className = "flex items-start justify-start ";

      const districtEl = document.createElement("p");
      districtEl.innerHTML = `<svg class="w-5 h-5 shrink-0  "  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><!-- Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md --><path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855q-.215.403-.395.872c.705.157 1.472.257 2.282.287zM4.249 3.539q.214-.577.481-1.078a7 7 0 0 1 .597-.933A7 7 0 0 0 3.051 3.05q.544.277 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9 9 0 0 1-1.565-.667A6.96 6.96 0 0 0 1.018 7.5zm1.4-2.741a12.3 12.3 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332M8.5 5.09V7.5h2.99a12.3 12.3 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.6 13.6 0 0 1 7.5 10.91V8.5zm3.99 0v2.409c.91.03 1.783.145 2.591.332c.223-.827.364-1.754.4-2.741zm-3.282 3.696q.18.469.395.872c.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a7 7 0 0 1-.598-.933a9 9 0 0 1-.481-1.079a8.4 8.4 0 0 0-1.198.49a7 7 0 0 0 2.276 1.522zm-1.383-2.964A13.4 13.4 0 0 1 3.508 8.5h-2.49a6.96 6.96 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667m6.728 2.964a7 7 0 0 0 2.275-1.521a8.4 8.4 0 0 0-1.197-.49a9 9 0 0 1-.481 1.078a7 7 0 0 1-.597.933M8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855q.216-.403.395-.872A12.6 12.6 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.96 6.96 0 0 0 14.982 8.5h-2.49a13.4 13.4 0 0 1-.437 3.008M14.982 7.5a6.96 6.96 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667c.248.92.4 1.938.437 3.008zM11.27 2.461q.266.502.482 1.078a8.4 8.4 0 0 0 1.196-.49a7 7 0 0 0-2.275-1.52c.218.283.418.597.597.932m-.488 1.343a8 8 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z"/></svg> 
      <span class="font-semibold cursor-pointer text-sky-400/80"> 
      ${toTitleCase(collage.district)}</span>`;
      districtEl.className = "text-slate-100 pt-2  flex items-center  gap-2";

      let Cop = false;
      districtEl.addEventListener("click", () => {
        const textToCopy = toTitleCase(collage.district);

        if (Cop) return;

        Cop = true;

        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            // create span
            const successIcon = document.createElement("div");

            successIcon.className = "ml-2 flex items-center gap-2";
            successIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z"/></svg>  `;
            successIcon.className = "ml-2 ";

            districtEl.appendChild(successIcon);

            // remove few second
            setTimeout(() => {
              successIcon.remove();
              Copy = false;
            }, 3000);
          })
          .catch((err) => {
            console.error("Copy failed: ", err);
          });
      });

      divdistrictEl.append(districtEl);

      // address
      const divaddressEl = document.createElement("div");
      divaddressEl.className = "flex items-start justify-start ";

      const addressEl = document.createElement("p");
      addressEl.innerHTML = `<svg class="w-5 h-5 shrink-0 "  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE --><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"/></svg> <span class="font-semibold text-sky-400/80">${toTitleCase(collage.address)}</span>`;
      addressEl.className =
        "text-slate-100 w-full cursor-pointer  pt-2 flex items-center gap-2";

      let isCopying = false;

      addressEl.addEventListener("click", () => {
        const textToCopy = toTitleCase(collage.address);

        if (isCopying) return;

        isCopying = true;

        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            // create span
            const successIcon = document.createElement("div");

            successIcon.className = "ml-2 flex items-center gap-2";
            successIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z"/></svg>  `;
            successIcon.className = "ml-2 ";

            addressEl.appendChild(successIcon);

            // remove few second
            setTimeout(() => {
              successIcon.remove();
              isCopying = false;
            }, 3000);
          })
          .catch((err) => {
            console.error("Copy failed: ", err);
          });
      });

      divaddressEl.append(addressEl);

      const courseBtnEl = document.createElement("button");
      courseBtnEl.className =
        "absolute right-3 bottom-3 px-3 py-2 bg-slate-800/80 text-sky-400/80 active:scale-95 transition-all border border-transparent hover:border-sky-400 hover:bg-gray-900/70 hover:-translate-y-0.5 duration-300 ease-in-out rounded cursor-pointer";
      courseBtnEl.textContent = `View Courses`;

      // course info show
      // console.log(collage);

      courseBtnEl.addEventListener("click", () => courseInfoShow(collage));

      // append
      cardEl.append(
        divcollageNameEl,
        institutionTypeEL,
        universityEl2,
        divdistrictEl,
        divaddressEl,
        courseBtnEl,
      );
      fragment.append(cardEl);
    });

    containerEl.append(fragment);
  }

  // event handling

  // state change
  stateEl.addEventListener("change", function () {
    // search.value = state.value;
    getSearchByState(stateEl.value);

    // other temp data clear
    filteredDistrictArr = [];
    filteredInstituteArr = [];
    filteredUniversityArr = [];
    filteredProgrammeArr = [];

    // other options reset
    districtEl.value = "All";
    institutionTypeEl.value = "All";
    UniversityEl.value = "All";
    programmeEl.value = "All";
  });

  //  district  filter method
  districtEl.addEventListener("change", () => {
    // value is extract the html page
    const districtType = districtEl.value;

    if (districtType === "All") {
      getSearchByState(stateEl.value);
      // console.log(filteredStateArr);
      filteredDistrictArr = filteredStateArr;
      renderFn(filteredDistrictArr);
    } else {
      filteredDistrictArr = filteredStateArr.filter(
        (college) => college.district == districtType,
      );
      // collageDataArr = filteredDistrictArr;
      //  console.log(filteredDistrictArr);
      renderFn(filteredDistrictArr);

      // other temp data clear
      filteredInstituteArr = [];
      filteredUniversityArr = [];
      filteredProgrammeArr = [];

      // other options reset
      institutionTypeEl.value = "All";
      UniversityEl.value = "All";
      programmeEl.value = "All";
    }
  });

  //search by institution type
  institutionTypeEl.addEventListener("change", () => {
    // value extract in the html page
    let institutionType = institutionTypeEl.value;
    // console.log(institutionType);

    if (institutionType === "All") {
      filteredInstituteArr = filteredDistrictArr;
      renderFn(filteredInstituteArr);
    } else {
      if (filteredDistrictArr.length === 0) {
        filteredDistrictArr = filteredStateArr;
      } else {
        filteredInstituteArr = filteredDistrictArr.filter(
          (collage) => collage.institution_type === institutionType,
        );
      }
      // console.log(filteredData);
      renderFn(filteredInstituteArr);

      // other temp data clear
      filteredUniversityArr = [];
      filteredProgrammeArr = [];

      // other options reset
      UniversityEl.value = "All";
      programmeEl.value = "All";
    }
  });

  // search by university
  UniversityEl.addEventListener("change", () => {
    let university = UniversityEl.value;

    if (university === "All") {
      filteredUniversityArr = filteredInstituteArr;
      renderFn(filteredUniversityArr);
    } else {
      if (filteredInstituteArr.length === 0) {
        filteredInstituteArr = filteredDistrictArr;
        if (filteredDistrictArr.length === 0) {
          filteredInstituteArr = filteredStateArr;
        }
      } else {
        filteredUniversityArr = filteredInstituteArr.filter(
          (collage) => collage.university === university,
        );
        renderFn(filteredUniversityArr);

        // other temp data clear
        filteredProgrammeArr = [];

        // other options reset
        programmeEl.value = "All";
      }
    }
  });

  // filter by programme
  programmeEl.addEventListener("change", () => {
    let programmeVal = programmeEl.value;
    if (programmeVal == "All") {
      filteredProgrammeArr = filteredUniversityArr;
      renderFn(filteredProgrammeArr);
    } else {
      if (filteredUniversityArr.length === 0) {
        filteredUniversityArr = filteredInstituteArr;
        if (filteredInstituteArr.length === 0) {
          filteredUniversityArr = filteredDistrictArr;
          if (filteredDistrictArr.length === 0) {
            filteredUniversityArr = filteredStateArr;
          }
        }
      } else {
        filteredProgrammeArr = filteredUniversityArr.filter((collage) => {
          const hasMatch = collage.programmes.some((programme) => {
            // console.log("programme: ", programme.programme);

            const isMatch = programme.programme === programmeVal;
            // console.log(isMatch);

            return isMatch;
          });

          // console.log("This collage had the course? ", hasMatch);
          // console.log("---------------------------");

          return hasMatch;
        });

        renderFn(filteredProgrammeArr);
      }
    }
  });

  // input search
  // searchBtnEl.addEventListener("click", collageSearchByName);
  searchInputEL.addEventListener("input", debounce(collageSearchByName, 2000));

  function debounce(func, delay) {
    let timer;

    return function (...args) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const allCollagesArrValue = await getAllCollages(allStateArr);

  // search activate Fn
  if (allCollagesArrValue) {
    loadingAlertEL.classList.add("hidden");
    searchAlertEl.classList.remove("hidden");
    searchInputEL.readOnly = false;
    searchInputEL.title = "now you can search😊...";
    searchInputEL.classList.replace("cursor-wait", "cursor-text");
    searchInputEL.classList.add("outline", "outline-green-600", "scale-110");
    setTimeout(() => {
      searchInputEL.classList.remove(
        "outline",
        "outline-green-600",
        "scale-110",
      );
    }, 3000);
  }

  // first render All collages show
  // renderFn(allCollagesArrValue);

  async function getAllCollages(arr) {
    try {
      const results = [];

      for (const state of arr) {
        const response = await fetch(
          `${BASE_API_KEY}/institutions/states/${state.name}`,
        );

        if (!response.ok) {
          throw new Error("Network response war not ok");
        }
        const data = await response.json();
        results.push(...data.data);
      }
      return results;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // search by collage name
  function collageSearchByName() {
    //change filter status
    // filterStatusEl.innerHTML = `<strong>Filtered by:</strong> ${searchInputEL.value} (Collage Name)`;

    const searchValue = searchInputEL.value.trim().toUpperCase();
    // console.log("fscscst aBctxx ".includes("abct"));

    //filter fn
    if (searchValue.length > 2) {
      const filteredData = allCollagesArrValue.filter((collage) =>
        collage.institute_name.includes(searchValue),
      );
      renderFn(filteredData, true);
    }
  }

  // Individual collage course info show
  function courseInfoShow(collage) {
    const programmesArr = collage.programmes;

    courseTableEl.innerHTML = "";

    programmesArr.forEach((programme) => {
      //   console.log(programme);

      const trEl = document.createElement("tr");
      // course
      const courseTdEL = document.createElement("td");
      courseTdEL.textContent = programme.course;
      // level
      const levelTdEL = document.createElement("td");
      levelTdEL.textContent = programme.level;
      // programme
      const programmeTdEL = document.createElement("td");
      programmeTdEL.textContent = programme.programme;
      // course
      const availabilityTdEL = document.createElement("td");
      availabilityTdEL.textContent = programme.availability;

      // append
      trEl.append(courseTdEL, levelTdEL, programmeTdEL, availabilityTdEL);
      courseTableEl.append(trEl);
    });

    courseDialogEL.showModal();
  }
});
