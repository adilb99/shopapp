module.exports = {
    hrPool: {
      user: "system",
      password: "oracle",
      connectString: "(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST   = 192.168.99.100)(PORT = 49161))(CONNECT_DATA =(SID = xe)(SERVER = DEDICATED)))",
      poolMin: 10,
      poolMax: 10,
      poolIncrement: 0
    }
  };