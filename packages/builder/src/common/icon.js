import feather from "feather-icons";
const getIcon = (icon, size) => feather.icons[icon].toSvg({height:size||"24", width:size||"24"});
export default getIcon;