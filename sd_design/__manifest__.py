# -*- coding: utf-8 -*-
{
    'name': "sd-design",

    'summary': """
        SDDesign UI""",

    'description': """
       
    """,

    'author': "source-dynamic",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/14.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'UI',
    'version': '1.0.0',

    # any module necessary for this one to work correctly
    'depends': ['web'],
    'assets': {
        'web.assets_frontend': [
            'sd_design/static/src/css/sd-design.css',
            ('after', 'web/static/lib/owl/owl.js', 'sd_design/static/src/sd-design.js'),
        ],
        'web.assets_backend': [
            'sd_design/static/src/css/sd-design.css',
            ('after', 'web/static/lib/owl/owl.js', 'sd_design/static/src/sd-design.js'),
        ]
    }
}
