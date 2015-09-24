<?php
interface Email {
  public function checkEmail($email);
  public function sendEmail($optional);
}
?>
