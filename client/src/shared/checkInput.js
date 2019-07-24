const checkRegex = (id, value) => {
  let regex = null;
  let errors = null;

  if (id === 'nom') {
      regex = /^[A-Z]*(?:-[A-Z]+)*$/i;
      if (!regex.test(value))
          errors = '* Nom incorect';
  }
  else if (id === 'prenom'){
      regex = /^[A-Z]*(?:-[A-Z]+)*$/i;
      if (!regex.test(value))
          errors = '* Prenom incorect';
  }   
  else if (id === 'mail') {
      regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      if (!regex.test(value))
          errors = '* Adresse Mail incorect';
  }
  else if (id === 'login') {
      regex= /^[A-Z][A-Z0-9]*(?:[-_][A-Z0-9]+)*$/i;
      if (!regex.test(value))
          errors = '* Login incorect';
  }
  else if (id === 'mot_de_passe') {
      regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
      if (!regex.test(value))
          errors = '* Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';
  }

  return errors;
}

export const checkInput = (id, value, min, max) => {
  let error = null;

  if (value.length < min)
      error = `${min} characters min.`;
  else if (value.length > max)
      error = `${max} characters max.`;
  else {
      error = checkRegex(id, value);
  }

  return error;
}