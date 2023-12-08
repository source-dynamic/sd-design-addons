from odoo import models, fields


class DesignModel(models.Model):
    _name = "sd_design_demo.design.model"

    field1 = fields.Char()
    field2 = fields.Integer()
