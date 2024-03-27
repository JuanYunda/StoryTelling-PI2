

module.exports = {

   async transcriptAudio(req, res){
      try {
         const categoryProps = req.body;
            
         res.status(200).send({ message: "categoria creada con exito"});
      } catch (err) {
         res.status(400).send({message: err});
      }

   },


}