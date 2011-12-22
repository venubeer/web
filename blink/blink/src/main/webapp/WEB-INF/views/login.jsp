<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"
%>
<html>
<head>	
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<meta http-equiv="Content-Style-Type" content="text/css">
	<meta http-equiv="Cache-Control" content="no-store,no-cache,must-revalidate">
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="Expires" content="-1">
	
	<title>Blink - Login Page</title>
	<script language=javascript>
        <!--
		function validateForm(form){
	        if (trim(form.j_username.value) == "") {
				alert("Enter a valid Username and Password.");
				form.j_username.focus();
				return false;
		    }
	        if (trim(form.j_password.value) == "") {
				alert("Enter a valid Username and Password.");
				form.j_password.focus();
				return false;
		    }
		    return true;			
		}		
	
		function trim(a) { 
	    	while (a.substring(0,1) == ' ') 
	        	a = a.substring(1, a.length);
	        while (a.substring(a.length-1,a.length) == ' ')
	        	a = a.substring(0, a.length-1);
	        return a;
		} 
        //-->
    </script>
	
</head>
<body>


<div align="center">

	<form method="POST" action="j_security_check" name="loginForm">
	
		<table width="40%" border="0" cellpadding="3" cellspacing="0">
                <tr> 
                    <td valign="bottom"> 
                        <div align="center"><b>Please Log In</b></div>
                    </td>
                    <td nowrap valign="top"> 
                        <div align="right"> 
                        </div>
                    </td>
                </tr>
                <tr> 
                    <td colspan="2">
                        <table border="0" align="center">
                            <tr valign="middle"> 
                                <td class="text" valign="middle" colspan="2"> 
                                    <div align="right">&nbsp;</div>
                                </td>
                            </tr>
                            <tr valign="middle"> 
                                <td class="text" valign="middle"> 
                                    <div align="right"><b>Username</b></div>
                                </td>
                                <td valign="top"> 
                                    <input type="text" name="j_username" size="20" maxlength="12">
                                </td>
                            </tr>
                            <tr> 
                                <td class="text" valign="middle"> 
                                    <div align="right"><b>Password</b></div>
                                </td>
                                <td valign="top"> 
                                    <input type="password" name="j_password" size="20" maxlength="12">
                                </td>
                            </tr>
                            <tr> 
                                <td class="text"> 
                                    <div align="right"></div>
                                </td>
                                <td valign="top"> 
                                    <p><span> 
                                    <input class="button" type="submit" name="Submit" value="Enter">
                                    </span></p>
                                    <p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
	</form>
	<div>
	This system is for authorized business use only.  Unauthorized access or activity may be a violation of law.
	This organization has the ability and reserves the right to monitor system activity in accordance with applicable law for 
	purposes of security and ensuring compliance with law and the company's policies regarding the use of its computer systems.
	</div>
</div>
<script language="JavaScript" type="text/javascript">
  <!--
    document.loginForm.j_username.focus();
  // -->
</script>

</body>
</html>
