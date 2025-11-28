"use client";

import { useState } from "react";
import { ArrowLeft, Upload, PlusCircle, Trash2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ... (keep all your existing imports and statesAndLGAs object)

const statesAndLGAs = {
  "Abia": [
    "Aba North",
    "Aba South",
    "Arochukwu",
    "Bende",
    "Ikwuano",
    "Isiala-Ngwa North",
    "Isiala-Ngwa South",
    "Isuikwato",
    "Obi Nwa",
    "Ohafia",
    "Osisioma",
    "Ngwa",
    "Ugwunagbo",
    "Ukwa East",
    "Ukwa West",
    "Umuahia North",
    "Umuahia South",
    "Umu-Neochi"
  ],
  "Adamawa": [
    "Demsa",
    "Fufore",
    "Ganaye",
    "Gireri",
    "Gombi",
    "Guyuk",
    "Hong",
    "Jada",
    "Lamurde",
    "Madagali",
    "Maiha",
    "Mayo-Belwa",
    "Michika",
    "Mubi North",
    "Mubi South",
    "Numan",
    "Shelleng",
    "Song",
    "Toungo",
    "Yola North",
    "Yola South"
  ],
  "Anambra": [
    "Aguata",
    "Anambra East",
    "Anambra West",
    "Anaocha",
    "Awka North",
    "Awka South",
    "Ayamelum",
    "Dunukofia",
    "Ekwusigo",
    "Idemili North",
    "Idemili south",
    "Ihiala",
    "Njikoka",
    "Nnewi North",
    "Nnewi South",
    "Ogbaru",
    "Onitsha North",
    "Onitsha South",
    "Orumba North",
    "Orumba South",
    "Oyi"
  ],
  "Akwa Ibom": [
    "Abak",
    "Eastern Obolo",
    "Eket",
    "Esit Eket",
    "Essien Udim",
    "Etim Ekpo",
    "Etinan",
    "Ibeno",
    "Ibesikpo Asutan",
    "Ibiono Ibom",
    "Ika",
    "Ikono",
    "Ikot Abasi",
    "Ikot Ekpene",
    "Ini",
    "Itu",
    "Mbo",
    "Mkpat Enin",
    "Nsit Atai",
    "Nsit Ibom",
    "Nsit Ubium",
    "Obot Akara",
    "Okobo",
    "Onna",
    "Oron",
    "Oruk Anam",
    "Udung Uko",
    "Ukanafun",
    "Uruan",
    "Urue-Offong/Oruko ",
    "Uyo"
  ],
  "Bauchi": [
    "Alkaleri",
    "Bauchi",
    "Bogoro",
    "Damban",
    "Darazo",
    "Dass",
    "Ganjuwa",
    "Giade",
    "Itas/Gadau",
    "Jama'are",
    "Katagum",
    "Kirfi",
    "Misau",
    "Ningi",
    "Shira",
    "Tafawa-Balewa",
    "Toro",
    "Warji",
    "Zaki"
  ],
  "Bayelsa": [
    "Brass",
    "Ekeremor",
    "Kolokuma/Opokuma",
    "Nembe",
    "Ogbia",
    "Sagbama",
    "Southern Jaw",
    "Yenegoa"
  ],
  "Benue": [
    "Ado",
    "Agatu",
    "Apa",
    "Buruku",
    "Gboko",
    "Guma",
    "Gwer East",
    "Gwer West",
    "Katsina-Ala",
    "Konshisha",
    "Kwande",
    "Logo",
    "Makurdi",
    "Obi",
    "Ogbadibo",
    "Oju",
    "Okpokwu",
    "Ohimini",
    "Oturkpo",
    "Tarka",
    "Ukum",
    "Ushongo",
    "Vandeikya"
  ],
  "Borno": [
    "Abadam",
    "Askira/Uba",
    "Bama",
    "Bayo",
    "Biu",
    "Chibok",
    "Damboa",
    "Dikwa",
    "Gubio",
    "Guzamala",
    "Gwoza",
    "Hawul",
    "Jere",
    "Kaga",
    "Kala/Balge",
    "Konduga",
    "Kukawa",
    "Kwaya Kusar",
    "Mafa",
    "Magumeri",
    "Maiduguri",
    "Marte",
    "Mobbar",
    "Monguno",
    "Ngala",
    "Nganzai",
    "Shani"
  ],
  "Cross River": [
    "Akpabuyo",
    "Odukpani",
    "Akamkpa",
    "Biase",
    "Abi",
    "Ikom",
    "Yarkur",
    "Odubra",
    "Boki",
    "Ogoja",
    "Yala",
    "Obanliku",
    "Obudu",
    "Calabar South",
    "Etung",
    "Bekwara",
    "Bakassi",
    "Calabar Municipality"
  ],
  "Delta": [
    "Oshimili",
    "Aniocha",
    "Aniocha South",
    "Ika South",
    "Ika North-East",
    "Ndokwa West",
    "Ndokwa East",
    "Isoko south",
    "Isoko North",
    "Bomadi",
    "Burutu",
    "Ughelli South",
    "Ughelli North",
    "Ethiope West",
    "Ethiope East",
    "Sapele",
    "Okpe",
    "Warri North",
    "Warri South",
    "Uvwie",
    "Udu",
    "Warri Central",
    "Ukwani",
    "Oshimili North",
    "Patani"
  ],
  "Ebonyi": [
    "Edda",
    "Afikpo",
    "Onicha",
    "Ohaozara",
    "Abakaliki",
    "Ishielu",
    "lkwo",
    "Ezza",
    "Ezza South",
    "Ohaukwu",
    "Ebonyi",
    "Ivo"
  ],
  "Enugu": [
    "Enugu South,",
    "Igbo-Eze South",
    "Enugu North",
    "Nkanu",
    "Udi Agwu",
    "Oji-River",
    "Ezeagu",
    "IgboEze North",
    "Isi-Uzo",
    "Nsukka",
    "Igbo-Ekiti",
    "Uzo-Uwani",
    "Enugu Eas",
    "Aninri",
    "Nkanu East",
    "Udenu."
  ],
  "Edo": [
    "Esan North-East",
    "Esan Central",
    "Esan West",
    "Egor",
    "Ukpoba",
    "Central",
    "Etsako Central",
    "Igueben",
    "Oredo",
    "Ovia SouthWest",
    "Ovia South-East",
    "Orhionwon",
    "Uhunmwonde",
    "Etsako East",
    "Esan South-East"
  ],
  "Ekiti": [
    "Ado",
    "Ekiti-East",
    "Ekiti-West",
    "Emure/Ise/Orun",
    "Ekiti South-West",
    "Ikere",
    "Irepodun",
    "Ijero,",
    "Ido/Osi",
    "Oye",
    "Ikole",
    "Moba",
    "Gbonyin",
    "Efon",
    "Ise/Orun",
    "Ilejemeje."
  ],
  "FCT": [
    "Abaji",
    "Abuja Municipal",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali"
  ],
  "Gombe": [
    "Akko",
    "Balanga",
    "Billiri",
    "Dukku",
    "Kaltungo",
    "Kwami",
    "Shomgom",
    "Funakaye",
    "Gombe",
    "Nafada/Bajoga",
    "Yamaltu/Delta."
  ],
  "Imo": [
    "Aboh-Mbaise",
    "Ahiazu-Mbaise",
    "Ehime-Mbano",
    "Ezinihitte",
    "Ideato North",
    "Ideato South",
    "Ihitte/Uboma",
    "Ikeduru",
    "Isiala Mbano",
    "Isu",
    "Mbaitoli",
    "Mbaitoli",
    "Ngor-Okpala",
    "Njaba",
    "Nwangele",
    "Nkwerre",
    "Obowo",
    "Oguta",
    "Ohaji/Egbema",
    "Okigwe",
    "Orlu",
    "Orsu",
    "Oru East",
    "Oru West",
    "Owerri-Municipal",
    "Owerri North",
    "Owerri West"
  ],
  "Jigawa": [
    "Auyo",
    "Babura",
    "Birni Kudu",
    "Biriniwa",
    "Buji",
    "Dutse",
    "Gagarawa",
    "Garki",
    "Gumel",
    "Guri",
    "Gwaram",
    "Gwiwa",
    "Hadejia",
    "Jahun",
    "Kafin Hausa",
    "Kaugama Kazaure",
    "Kiri Kasamma",
    "Kiyawa",
    "Maigatari",
    "Malam Madori",
    "Miga",
    "Ringim",
    "Roni",
    "Sule-Tankarkar",
    "Taura",
    "Yankwashi"
  ],
  "Kaduna": [
    "Birni-Gwari",
    "Chikun",
    "Giwa",
    "Igabi",
    "Ikara",
    "jaba",
    "Jema'a",
    "Kachia",
    "Kaduna North",
    "Kaduna South",
    "Kagarko",
    "Kajuru",
    "Kaura",
    "Kauru",
    "Kubau",
    "Kudan",
    "Lere",
    "Makarfi",
    "Sabon-Gari",
    "Sanga",
    "Soba",
    "Zango-Kataf",
    "Zaria"
  ],
  "Kano": [
    "Ajingi",
    "Albasu",
    "Bagwai",
    "Bebeji",
    "Bichi",
    "Bunkure",
    "Dala",
    "Dambatta",
    "Dawakin Kudu",
    "Dawakin Tofa",
    "Doguwa",
    "Fagge",
    "Gabasawa",
    "Garko",
    "Garum",
    "Mallam",
    "Gaya",
    "Gezawa",
    "Gwale",
    "Gwarzo",
    "Kabo",
    "Kano Municipal",
    "Karaye",
    "Kibiya",
    "Kiru",
    "kumbotso",
    "Ghari",
    "Kura",
    "Madobi",
    "Makoda",
    "Minjibir",
    "Nasarawa",
    "Rano",
    "Rimin Gado",
    "Rogo",
    "Shanono",
    "Sumaila",
    "Takali",
    "Tarauni",
    "Tofa",
    "Tsanyawa",
    "Tudun Wada",
    "Ungogo",
    "Warawa",
    "Wudil"
  ],
  "Katsina": [
    "Bakori",
    "Batagarawa",
    "Batsari",
    "Baure",
    "Bindawa",
    "Charanchi",
    "Dandume",
    "Danja",
    "Dan Musa",
    "Daura",
    "Dutsi",
    "Dutsin-Ma",
    "Faskari",
    "Funtua",
    "Ingawa",
    "Jibia",
    "Kafur",
    "Kaita",
    "Kankara",
    "Kankia",
    "Katsina",
    "Kurfi",
    "Kusada",
    "Mai'Adua",
    "Malumfashi",
    "Mani",
    "Mashi",
    "Matazuu",
    "Musawa",
    "Rimi",
    "Sabuwa",
    "Safana",
    "Sandamu",
    "Zango"
  ],
  "Kebbi": [
    "Aleiro",
    "Arewa-Dandi",
    "Argungu",
    "Augie",
    "Bagudo",
    "Birnin Kebbi",
    "Bunza",
    "Dandi",
    "Fakai",
    "Gwandu",
    "Jega",
    "Kalgo",
    "Koko/Besse",
    "Maiyama",
    "Ngaski",
    "Sakaba",
    "Shanga",
    "Suru",
    "Wasagu/Danko",
    "Yauri",
    "Zuru"
  ],
  "Kogi": [
    "Adavi",
    "Ajaokuta",
    "Ankpa",
    "Bassa",
    "Dekina",
    "Ibaji",
    "Idah",
    "Igalamela-Odolu",
    "Ijumu",
    "Kabba/Bunu",
    "Kogi",
    "Lokoja",
    "Mopa-Muro",
    "Ofu",
    "Ogori/Mangongo",
    "Okehi",
    "Okene",
    "Olamabolo",
    "Omala",
    "Yagba East",
    "Yagba West"
  ],
  "Kwara": [
    "Asa",
    "Baruten",
    "Edu",
    "Ekiti",
    "Ifelodun",
    "Ilorin East",
    "Ilorin West",
    "Irepodun",
    "Isin",
    "Kaiama",
    "Moro",
    "Offa",
    "Oke-Ero",
    "Oyun",
    "Pategi"
  ],
  "Lagos": [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti-Osa",
    "Ibeju/Lekki",
    "Ifako-Ijaye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere"
  ],
  "Nasarawa": [
    "Akwanga",
    "Awe",
    "Doma",
    "Karu",
    "Keana",
    "Keffi",
    "Kokona",
    "Lafia",
    "Nasarawa",
    "Nasarawa-Eggon",
    "Obi",
    "Toto",
    "Wamba"
  ],
  "Niger": [
    "Agaie",
    "Agwara",
    "Bida",
    "Borgu",
    "Bosso",
    "Chanchaga",
    "Edati",
    "Gbako",
    "Gurara",
    "Katcha",
    "Kontagora",
    "Lapai",
    "Lavun",
    "Magama",
    "Mariga",
    "Mashegu",
    "Mokwa",
    "Muya",
    "Pailoro",
    "Rafi",
    "Rijau",
    "Shiroro",
    "Suleja",
    "Tafa",
    "Wushishi"
  ],
  "Ogun": [
    "Abeokuta North",
    "Abeokuta South",
    "Ado-Odo/Ota",
    "Yewa North",
    "Yewa South",
    "Ewekoro",
    "Ifo",
    "Ijebu East",
    "Ijebu North",
    "Ijebu North East",
    "Ijebu Ode",
    "Ikenne",
    "Imeko-Afon",
    "Ipokia",
    "Obafemi-Owode",
    "Ogun Waterside",
    "Odeda",
    "Odogbolu",
    "Remo North",
    "Shagamu"
  ],
  "Ondo": [
    "Akoko North East",
    "Akoko North West",
    "Akoko South Akure East",
    "Akoko South West",
    "Akure North",
    "Akure South",
    "Ese-Odo",
    "Idanre",
    "Ifedore",
    "Ilaje",
    "Ile-Oluji",
    "Okeigbo",
    "Irele",
    "Odigbo",
    "Okitipupa",
    "Ondo East",
    "Ondo West",
    "Ose",
    "Owo"
  ],
  "Osun": [
    "Aiyedade",
    "Aiyedire",
    "Atakumosa East",
    "Atakumosa West",
    "Boluwaduro",
    "Boripe",
    "Ede North",
    "Ede South",
    "Egbedore",
    "Ejigbo",
    "Ife Central",
    "Ife East",
    "Ife North",
    "Ife South",
    "Ifedayo",
    "Ifelodun",
    "Ila",
    "Ilesha East",
    "Ilesha West",
    "Irepodun",
    "Irewole",
    "Isokan",
    "Iwo",
    "Obokun",
    "Odo-Otin",
    "Ola-Oluwa",
    "Olorunda",
    "Oriade",
    "Orolu",
    "Osogbo"
  ],
  "Oyo": [
    "Afijio",
    "Akinyele",
    "Atiba",
    "Atisbo",
    "Egbeda",
    "Ibadan Central",
    "Ibadan North",
    "Ibadan North West",
    "Ibadan South East",
    "Ibadan South West",
    "Ibarapa Central",
    "Ibarapa East",
    "Ibarapa North",
    "Ido",
    "Irepo",
    "Iseyin",
    "Itesiwaju",
    "Iwajowa",
    "Kajola",
    "Lagelu Ogbomosho North",
    "Ogbomosho South",
    "Ogo Oluwa",
    "Olorunsogo",
    "Oluyole",
    "Ona-Ara",
    "Orelope",
    "Ori Ire",
    "Oyo East",
    "Oyo West",
    "Saki East",
    "Saki West",
    "Surulere"
  ],
  "Plateau": [
    "Barikin Ladi",
    "Bassa",
    "Bokkos",
    "Jos East",
    "Jos North",
    "Jos South",
    "Kanam",
    "Kanke",
    "Langtang North",
    "Langtang South",
    "Mangu",
    "Mikang",
    "Pankshin",
    "Qua'an Pan",
    "Riyom",
    "Shendam",
    "Wase"
  ],
  "Rivers": [
    "Abua/Odual",
    "Ahoada East",
    "Ahoada West",
    "Akuku Toru",
    "Andoni",
    "Asari-Toru",
    "Bonny",
    "Degema",
    "Emohua",
    "Eleme",
    "Etche",
    "Gokana",
    "Ikwerre",
    "Khana",
    "Obio/Akpor",
    "Ogba/Egbema/Ndoni",
    "Ogu/Bolo",
    "Okrika",
    "Omumma",
    "Opobo/Nkoro",
    "Oyigbo",
    "Port-Harcourt",
    "Tai"
  ],
  "Sokoto": [
    "Binji",
    "Bodinga",
    "Dange-shnsi",
    "Gada",
    "Goronyo",
    "Gudu",
    "Gawabawa",
    "Illela",
    "Isa",
    "Kware",
    "kebbe",
    "Rabah",
    "Sabon birni",
    "Shagari",
    "Silame",
    "Sokoto North",
    "Sokoto South",
    "Tambuwal",
    "Tqngaza",
    "Tureta",
    "Wamako",
    "Wurno",
    "Yabo"
  ],
  "Taraba": [
    "Ardo-kola",
    "Bali",
    "Donga",
    "Gashaka",
    "Cassol",
    "Ibi",
    "Jalingo",
    "Karin-Lamido",
    "Kurmi",
    "Lau",
    "Sardauna",
    "Takum",
    "Ussa",
    "Wukari",
    "Yorro",
    "Zing"
  ],
  "Yobe": [
    "Bade",
    "Bursari",
    "Damaturu",
    "Fika",
    "Fune",
    "Geidam",
    "Gujba",
    "Gulani",
    "Jakusko",
    "Karasuwa",
    "Karawa",
    "Machina",
    "Nangere",
    "Nguru Potiskum",
    "Tarmua",
    "Yunusari",
    "Yusufari"
  ],
  "Zamfara": [
    "Anka",
    "Bakura",
    "Birnin Magaji",
    "Bukkuyum",
    "Bungudu",
    "Gummi",
    "Gusau",
    "Kaura",
    "Namoda",
    "Maradun",
    "Maru",
    "Shinkafi",
    "Talata Mafara",
    "Tsafe",
    "Zurmi"
  ]
};

const designCategories = [
  { name: "Logo Design", price: 15000 },
  { name: "Brand Identity", price: 35000 },
  { name: "Social Media Graphics", price: 10000 },
  { name: "Flyer/Poster Design", price: 8000 },
  { name: "Banner Design", price: 7500 },
  { name: "Business Card", price: 5000 },
  { name: "Website UI Design", price: 45000 },
  { name: "App UI Design", price: 50000 },
  { name: "T-shirt Design", price: 6000 },
  { name: "Package Design", price: 20000 },
];

export default function HireDesigner() {
  const [formData, setFormData] = useState({
    designTitle: "",
    fullName: "",
    email: "",
    phone: "",
    state: "",
    localGovernment: "",
    category: "",
    deadline: "",
    budget: "",
    description: "",
  });

  const [designSamples, setDesignSamples] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState({});
  const router = useRouter();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSampleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Maximum 5 samples
      if (designSamples.length + files.length > 5) {
        alert("Maximum 5 inspiration images allowed");
        return;
      }

      const newSamples = files.map(file => ({
        preview: URL.createObjectURL(file),
        file: file,
        name: file.name
      }));

      setDesignSamples([...designSamples, ...newSamples]);
    }
  };

  const removeDesignSample = (index) => {
    const updatedSamples = [...designSamples];
    URL.revokeObjectURL(updatedSamples[index].preview);
    updatedSamples.splice(index, 1);
    setDesignSamples(updatedSamples);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.designTitle) newErrors.designTitle = "Design title is required";
      if (!formData.category) newErrors.category = "Please select a category";
      if (!formData.description) newErrors.description = "Description is required";
    } else if (step === 2) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    setFormStep(formStep - 1);
    window.scrollTo(0, 0);
  };

  // ... (keep all your existing handler functions until handleSubmit)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(formStep)) return;

    setIsSubmitting(true);

    try {
      // Store in localStorage
      const dataToSave = {
        ...formData,
        status: "pending",
        requestDate: new Date().toISOString(),
        designId: `DSG-${Math.floor(Math.random() * 1000000)}`
      };

      localStorage.setItem("hireDesigner", JSON.stringify(dataToSave));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success toast
      toast.success("Your Hire Designer Request has been submitted!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to Products page after a short delay
      setTimeout(() => {
        router.push("/products");
      }, 2000);

    } catch (error) {
      toast.error("There was an error submitting your request. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-4 md:p-6">

      <div className="w-full max-w-3xl">
        {/* ... (keep all your existing JSX code) */}

        <div className="w-full max-w-3xl">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Link href="/view-products" className="mr-4">
              <button className="flex items-center text-yellow-500 hover:text-yellow-400">
                <ArrowLeft size={20} className="mr-1" />
                <span>Back to Products</span>
              </button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold flex-1 text-center pr-12">Hire a Designer</h1>
          </div>

          {/* Progress indicator */}
          <div className="w-full mb-8">
            <div className="flex justify-between mb-2">
              <span className={`font-medium ${formStep >= 1 ? 'text-yellow-500' : 'text-gray-500'}`}>Design Details</span>
              <span className={`font-medium ${formStep >= 2 ? 'text-yellow-500' : 'text-gray-500'}`}>Your Information</span>
              <span className={`font-medium ${formStep >= 3 ? 'text-yellow-500' : 'text-gray-500'}`}>Review & Submit</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${(formStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 md:p-8 rounded-lg w-full shadow-xl">
            {formStep === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold mb-4">Tell us about your design</h2>

                {/* Design Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">Design Title</label>
                  <input
                    type="text"
                    name="designTitle"
                    value={formData.designTitle}
                    onChange={handleChange}
                    placeholder="e.g., Logo for my coffee shop"
                    className={`w-full p-3 rounded-md bg-gray-800 text-white outline-none border ${errors.designTitle ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  {errors.designTitle && <p className="text-red-500 text-sm mt-1">{errors.designTitle}</p>}
                </div>

                {/* Design Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">Design Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-md bg-gray-800 text-white border ${errors.category ? 'border-red-500' : 'border-gray-700'}`}
                  >
                    <option value="">Select Design Category</option>
                    {designCategories.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name} - ₦{item.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline (Optional)</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 rounded-md bg-gray-800 text-white outline-none border border-gray-700"
                  />
                </div>

                {/* Budget Input */}
                <div>
                  <label className="block text-sm font-medium mb-1">Your Budget (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">₦</span>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="15,000"
                      className="w-full p-3 pl-8 rounded-md bg-gray-800 text-white outline-none border border-gray-700"
                    />
                  </div>
                </div>

                {/* Design Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what you're looking for in detail..."
                    className={`w-full p-3 h-32 rounded-md bg-gray-800 text-white outline-none border ${errors.description ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Upload Design Inspirations */}
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Inspirations (Optional)</label>
                  <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center">
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload size={28} className="text-gray-400 mb-2" />
                      <span className="text-gray-300">Click to upload (max 5 images)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSampleUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  </div>

                  {/* Show uploaded design samples */}
                  {designSamples.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Uploaded Inspirations:</h3>
                      <div className="flex flex-wrap gap-3">
                        {designSamples.map((sample, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={sample.preview}
                              alt={`Inspiration ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                            />
                            <button
                              type="button"
                              onClick={() => removeDesignSample(index)}
                              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {designSamples.length < 5 && (
                          <label className="w-20 h-20 flex items-center justify-center border border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-yellow-500 transition-colors">
                            <PlusCircle size={24} className="text-gray-400" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSampleUpload}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={goToNextStep}
                  className="w-full bg-yellow-500 text-black p-3 rounded-md font-semibold hover:bg-yellow-600 transition mt-6"
                >
                  Continue to Contact Details
                </button>
              </div>
            )}

            {formStep === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold mb-4">Your Contact Information</h2>

                {/* Contact Info Fields */}
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full p-3 rounded-md bg-gray-800 text-white outline-none border ${errors.fullName ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full p-3 rounded-md bg-gray-800 text-white outline-none border ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    className={`w-full p-3 rounded-md bg-gray-800 text-white outline-none border ${errors.phone ? 'border-red-500' : 'border-gray-700'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* State Selection */}
                <div>
                  <label className="block text-sm font-medium mb-1">State (Optional)</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700"
                  >
                    <option value="">Select State</option>
                    {Object.keys(statesAndLGAs).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Local Government Selection */}
                {formData.state && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Local Government (Optional)</label>
                    <select
                      name="localGovernment"
                      value={formData.localGovernment}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700"
                    >
                      <option value="">Select Local Government</option>
                      {formData.state &&
                        statesAndLGAs[formData.state].map((lga, index) => (
                          <option key={index} value={lga}>
                            {lga}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="w-1/2 bg-gray-700 text-white p-3 rounded-md font-medium hover:bg-gray-600 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="w-1/2 bg-yellow-500 text-black p-3 rounded-md font-semibold hover:bg-yellow-600 transition"
                  >
                    Review & Submit
                  </button>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Review Your Request</h2>

                {/* Summary of the design request */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-400">Design Title:</span>
                    <span className="font-medium">{formData.designTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-medium">{formData.category}</span>
                  </div>
                  {formData.deadline && (
                    <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                      <span className="text-gray-400">Deadline:</span>
                      <span className="font-medium">{new Date(formData.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  {formData.budget && (
                    <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                      <span className="text-gray-400">Budget:</span>
                      <span className="font-medium">₦{Number(formData.budget).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-2">
                    <span className="text-gray-400 block mb-1">Description:</span>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                </div>

                {/* Contact Information Summary */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-400">Full Name:</span>
                    <span className="font-medium">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                    <span className="text-gray-400">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  {formData.state && (
                    <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
                      <span className="text-gray-400">Location:</span>
                      <span className="font-medium">
                        {formData.state}{formData.localGovernment ? `, ${formData.localGovernment}` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Uploaded Inspirations */}
                {designSamples.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Uploaded Inspirations:</h3>
                    <div className="flex flex-wrap gap-3">
                      {designSamples.map((sample, index) => (
                        <img
                          key={index}
                          src={sample.preview}
                          alt={`Inspiration ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="w-1/2 bg-gray-700 text-white p-3 rounded-md font-medium hover:bg-gray-600 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 bg-yellow-500 text-black p-3 rounded-md font-semibold hover:bg-yellow-600 transition flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By submitting, you agree to our terms and conditions.
                  A designer will be assigned to your project within 24 hours.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}