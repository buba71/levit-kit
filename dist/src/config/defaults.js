"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULTS = void 0;
exports.DEFAULTS = {
    agents: {
        developer: true,
        code_reviewer: true,
        product_owner: false,
        qa: false,
        security: false,
        devops: false
    },
    ux: {
        presenter: true,
        feedback_collector: false
    },
    quality: {
        tests_required: true,
        code_review_required: true,
        human_validation_required: true
    },
    devops: {
        enabled: false,
        environments: {
            staging: true,
            production: false
        },
        require_human_approval_for_prod: true
    }
};
