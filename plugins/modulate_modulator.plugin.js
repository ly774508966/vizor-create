g_Plugins["modulate_modulator"] = function(core) {
	var self = this;
	
	this.input_slots = [ 
		{ name: 'value', dt: core.datatypes.FLOAT },
		{ name: 'limit', dt: core.datatypes.FLOAT } 
	];
	this.output_slots = [ { name: 'result', dt: core.datatypes.FLOAT } ];
	this.state = null;
	this.input_val = 0.0;
	this.limit_val = 1.0;
	this.output_val = 0.0;
	
	this.create_ui = function()
	{
		return null;
	};
	
	this.update_input = function(index, data)
	{
		if(index === 0)
			self.input_val = data;
		else
			self.limit_val = data == 0.0 ? 1.0 : data;
	};	

	this.update_state = function(delta_t)
	{
		self.output_val = self.input_val % self.limit_val;
	};
	
	this.update_output = function(index)
	{
		return self.output_val;
	};	
};