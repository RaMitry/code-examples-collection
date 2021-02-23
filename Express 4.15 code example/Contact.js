var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Contact Model
 * ==========
 */
var Contact = new keystone.List('Contact');

Contact.add({
	name: { type: Types.Text, required: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	comment: { type: Types.Textarea, required: false },
	datetime: { type: Types.Datetime, default: Date.now }
}
);

Contact.register();
