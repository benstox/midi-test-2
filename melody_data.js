var VI = {
    'introit_requiem' : 'f_fgfffgh_hggfgg.f.fgh_hghhjhgh!hgffgh_gfgg.f.hghgfhghgff.hghhjhgh!hgfgh_gfgg.f.fggfghhhhhhgh.fghhhhhhhhg!gh.fghhhhhhhhh.hhhhfghgff.f_fgfffgh_hggfgg.f.fgh_hghhjhgh!hgffgh_gfgg.f.hghgfhghgff.hghhjhgh!hgfgh_gfgg.f.',
    'kyrie_requiem' : 'fgh!hh.g.hgfefgff.fgh!hh.g.hgfefgff.fgh!hh.g.hgfefgff.fgh!h.g.hgfefgff.fgh!h.g.hgfefgff.fgh!h.g.hgfefgff.fgh!hh.g.hgfefgff.fgh!hh.g.hgfefgff.jff.j!jkj!hg.hgfefgff.',
    'resp_ne_recorderis' : 'dcffgh_hggfgg.f.fdfg!h!hg!.h!j_!hfgg.h!ghfdf_h_g_g.f.fhhghf_hghffdffgefgfdeddc.fghgh!hh.hjhggh!_hgfgh_gfgg.f.fg!_!!_h_!hgh_g_h!j_kjj!h!ghgfeghg.f.cdfffghffefg!_!_g_h!_hgghgfg.f.dcffgh_hggfgg.f.fdfg!h!hg!.h!j_!hfgg.h!ghfdf_h_g_g.f.fhhghf_hghffdffgefgfdeddc.fghgh!hh.hjhggh!_hgfgh_gfgg.f.fg!_!!_h_!hgh_g_h!j_kjj!h!ghgfeghg.f.cdfffghffefg!_!_g_h!_hgghgfg.f.',
    'agnus_cunctipotens' : 'fgghhgfef.fghhj!hgfghh.hfgfeg.ghff.fh!j.!kj!jhgfghh.hfgfeg.ghf.fgghhgfef.fghhj!hgfghh.hfgfeg.ghff.',
    'gloria_rex_splendens' : 'hghgffghhgghgff.fghhgfgddcdcff.fghhgfggf.hghghf.hhhgfgfd.ddcfgfd.hhhgfgfd.edccdcdfgf.ffghgffededdc.fghhfg.hgfggf.feghgfghhghgfef.h!hghgfddcfgff.hgfgfd.fghhhgff.fghhgff.ddcfggf.fghhfgfeed.fghhgfgf.ggfgghgfgghh.fghhhghfghggf.fgfghgfghggf.edefeed.fghhfgfgghh.fgfggh.fghgfgff.ghh!hh.fghhgfgdedcdff.ffggfghhgfggfe.d.dggfghg.f.',
    'agnus_de_angelis' : 'fggfghf_g_f_f.ffddcdcdff_g_f_f.fghhg!hghf_g_f_f.fhjjhgjj.jhghfgfghf_g_f_f.fghhg!hghf_g_f_f.fggfghf_g_f_f.ffddcdcdff_g_f_f.fghhg!hghf_g_f_f.',
    'kyrie_xvii' : 'fgfgh.j!hghfeghggf.fgfgh.j!hghfeghggf.fgfgh.j!hghfeghggf.jj.h!j.j!hghfeghggf.jj.h!j.j!hghfeghggf.jj.h!j.j!hghfeghggf.fhjjjk!j.j!hghfeghggf.fhjjjk!j.j!hghfeghggf.fhjjjk!j.fhjjk!j.j!hghfeghggf.',
    'kyrie_firmator_sancte' : 'fdff.gh!hgffdef.fdff.gh!hgffdef.fdff.gh!hgffdef.fjj!h!jkjjh!hgffdef.fjj!h!jkjjh!hgffdef.fjj!h!jkjjh!hgffdef.fjjkjmlkj.!jkjjh!hgffdef.fjjkjmlkj.!jkjjh.j!jkjjh!hgffdef.',
    'agnus_ad_lib_ii' : '!hghf.efggfdec.fdefg.f.!hghf.efggfdec.hfefg.f.!hghf.efggfdec.fdefg.f.',
    'ant_crucifixus' : 'fghghf.ghgfdfefd_e_dcdd.c.dffgh_ghgf_dfefd_e_dcdd_c_fggff.',
    'ant_gaudent_in_caelis' : 'ffgfedff_ffghghgf.f.ffdfg!!hghh_gfegghgf.f.fffcfh!j_j!!hgfgf!!hg_feghgf.f.fghhg!!hg.gfghhhghgf.f.',
    'communio_exsultavit' : 'cdffd.dcfgfef.fhghjijhjff_g_f_f.ffhjjfgh_g_jijhjg.fhghgegefede.d.fff.hijji_h_fhghgf.ffgfffhjjhjgfedgeff.',
    'resp_brev_hodie_scietis' : 'fgfffghh.g.fghgfdfggff.fgfffghh.g.fghgfdfggff.hh!hhghgg_hgfg_hh.g.fghgfdfggff.hhhh!h_hghgg_gghgfgg.h.fgfffghh.g.fghgfdfggff.',
    'introit_hodie_scietis' : 'dfffffgg!hgg.f.fdddfg_gfffdcde_d_cdfffgff.dffgffef.dfefdedcdd_c_fffffgf.fggfghhhhg!hgf.fghhjg.fffffffgfdfgf.dfffffgg!hgg.f.fdddfg_gfffdcde_d_cdfffgff.dffgffef.dfefdedcdd_c_fffffgf.',
    'ant_ipse_invocabit' : 'fffeggh_ffdc.fffeghh_hh_ggf.fghhhhghff.hhhfghgff.fghhhhg.hhhghf.hhfghgf.fffeggh_ffdc.fffeghh_hh_ggf.',
    'ant_regina_caeli' : 'fgfghh.!hg!hfgf.hghfggff_!gfghf.fj_jkkj!hgfghh.!!!_g!jfgf.!!!_g!jfgf.ghghf_g_f_f.!hgfghfhgfeff.!jkjj!j_jfgf.!hg!j_jfgff.jjfgh!hgfegff.ffhjkjj!gh.j!hfgf.fhjkjj!gh.j!hfgf.g!hghf_g_f_f.'
};