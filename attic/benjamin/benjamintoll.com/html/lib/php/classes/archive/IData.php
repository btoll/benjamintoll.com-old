<?php

interface IData {

  function clean($value);
  function validate();
  function getErrors();
  function setErrors($errors);
  function add();
  function getAll();
  function getRow($id);
  function __toString();

}

?>
