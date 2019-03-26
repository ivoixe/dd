	<div id="gear" data-role="gear">
					<input type="text" name="username" id="username"/>
					<button id="save">Save</button>
					<button id="load">Load</button>
					<button id="clear">Clear</button>
					 
					<script type="text/javascript">
					$(function() {
					   // Save input value to localStorage
					   $('#save').on('click', function() {
					      var username = $('#username').val();
					      localStorage.setItem("username", username);
					   });
					   // Load input value from localStorage
					   $('#load').on('click', function() {
					      var username = localStorage.getItem('username') || '<empty>';
					      $('#username').val(username);
					   });
					   // Clear localStorage
					   $('#clear').on('click', function() {
					      localStorage.clear();
					   });
					});
					</script>
			</div>