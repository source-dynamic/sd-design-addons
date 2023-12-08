# -*- coding: utf-8 -*-
{
    'name': "sd-design-demo",

    'summary': """
        SDDesign UI DEMO""",

    'description': """
       
    """,

    'author': "source-dynamic",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/14.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'UI',
    'version': '1.0.0',

    # any module necessary for this one to work correctly
    'depends': ['sd_design'],
    'data': [
        'security/ir.model.access.csv',
        'views/test_sd_design_views.xml',
        'views/menu.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'sd_design_demo/static/src/components/number_field.js',
            'sd_design_demo/static/src/client/test_sd_design_client.js',
        ]
    }
}
