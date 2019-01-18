const handleProfile = (req, resp, db) => {
  const { id } = req.params;
  let found = false;

  db.select('*').from('users').where({id}).then(user => {
    if (user.length) {
      resp.json(user[0]);
    } else {
      resp.status(400).json('not found')
    }
  }).catch(err =>resp.status(400).json('not found'));
}

module.exports = {
  handleProfile: handleProfile
}
