E2.plugins["instance_texture_modulator"] = function(core, node) {
	var self = this;
	var gl = core.renderer.context;
		
	this.desc = 'Create a scene that represents \'count\' instances of the supplied \'mesh\', distributed according to the intensity of the red channel of the supplied \'texture\', whereas the green channel specifies instance elevation.';
	this.input_slots = [ 
		{ name: 'count', dt: core.datatypes.FLOAT },
		{ name: 'mesh', dt: core.datatypes.MESH },
		{ name: 'texture', dt: core.datatypes.TEXTURE },
		{ name: 'scale', dt: core.datatypes.VERTEX }
	];
	
	this.output_slots = [ { name: 'scene', dt: core.datatypes.SCENE } ];

	this.update_input = function(slot, data)
	{
		if(slot.index === 0)
			self.count = Math.round(data);
		else if(slot.index === 1)
		{
			var s = self.scene;
			
			s.meshes = [data];
			s.vertex_count = data.vertex_count;
		}
		else if(slot.index === 2)
			self.texture_sampler = data.get_sampler();
		else if(slot.index === 3)
			self.scale = data;
		
		if(slot.index !== 1)
			self.dirty = true;
	};	

	this.update_state = function(delta_t)
	{
		var s = self.scene;
		
		if(self.dirty && self.texture_sampler)
		{
			var m = s.meshes[0];
			var inst = [];
			var cnt = 0, x, y, s;
			
			while(cnt < self.count)
			{
				var mat = mat4.create();
				
				mat4.identity(mat);
				
				x = Math.random();
				y = Math.random();
				s = self.texture_sampler.get_pixel(x, y);
				
				while(Math.random() * 255.0 > s[0])
				{
					x = Math.random();
					y = Math.random();
					s = self.texture_sampler.get_pixel(x, y);
				}
				
				mat4.translate(mat, [(x - 0.5) * self.scale[0], ((s[1] / 255.0) * self.scale[1]), (y - 0.5) * self.scale[2]]);
				inst.push(mat);
				cnt++;
			}
						
			m.instances = inst;
			self.dirty = false;
		}
	};	

	this.update_output = function(slot)
	{
		return self.scene;
	};

	this.state_changed = function(ui)
	{
		if(!ui)
		{
			self.scene = new Scene(gl, null, null);
			self.count = [1, 0, 1];
			self.texture = null;
			self.scale = [1, 1, 1];
			self.dirty = true;
		}
	};
};