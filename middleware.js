const Doctor = require("./models/doctorModel");
const Hospital = require("./models/hospitalModel");

module.exports.isAdmin = (req, res, next) =>{
    const roleHeader = req.headers.authorization;

    console.log(roleHeader);
  if (!roleHeader) {
    return res.status(404).json({ message: "User not found!!" });
  }

  const role = roleHeader.split(" ")[1];

  if (role !== "admin") {
    return res.status(401).json({ message: "Not allowed" });
  }

  next();
}

module.exports.isDoctor = (req, res, next) =>{
    const roleHeader = req.headers.authorization;

    console.log(roleHeader);
  if (!roleHeader) {
    return res.status(404).json({ message: "User not found!!" });
  }

  const role = roleHeader.split(" ")[1];

  if (role !== "doctor") {
    return res.status(401).json({ message: "Not allowed" });
  }

  next();
}


module.exports.isPatient = (req, res, next) =>{
    const roleHeader = req.headers.authorization;

    console.log(roleHeader);
  if (!roleHeader) {
    return res.status(404).json({ message: "User not found!!" });
  }

  const role = roleHeader.split(" ")[1];

  if (role !== "patient") {
    return res.status(401).json({ message: "Not allowed" });
  }

  next();
}

module.exports.isPharmacy = (req, res, next) =>{
    const roleHeader = req.headers.authorization;

    console.log(roleHeader);
  if (!roleHeader) {
    return res.status(404).json({ message: "User not found!!" });
  }

  const role = roleHeader.split(" ")[1];

  if (role !== "pharmacy") {
    return res.status(401).json({ message: "Not allowed" });
  }

  next();
}

