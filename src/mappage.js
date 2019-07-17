let _mapMapper;
let viewer;
$(document).ready(function() {
    console.log('Apple MacBook : _mapMapper', _mapMapper)
    _mapMapper = 'viewer = new Cesium.Viewer(\
	"MapViewer", {	orderIndependentTranslucency: false, \
			contextOptions: { \
				webgl: {\
					alpha: true\
				}\
			}, \
			animation: false,	\
			baseLayerPicker: true,	\
			geocoder: true, \
			timeline: false,\
			sceneModePicker: true,	\
			navigationHelpButton: false,\
			infoBox: true,\
			terrainProvider: Cesium.createWorldTerrain()\
		}\
	);\
	viewer.scene.skyBox.show = false;\
    viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);\
	loadLayer();';
    // leftmenu.update(1,"内容菜单");
    $(function() { $("[data-toggle='tooltip']").tooltip(); }); //显示tooltip
    var mbox = new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.satellite',
        accessToken: 'sk.eyJ1IjoibGVibGl1IiwiYSI6ImNqc2ptaXd1eTB0aXY0YXRiMXpxYnV5dGQifQ.1iFUUuHIT07d0zp_pZ8K1Q'
    });

    $("#MapViewer").css({ height: "100%", display: "block" });

    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOTk0ODgxNC0zYjhhLTQ1MDUtYjRiYy1kMmUzMzYyMTkzN2UiLCJpZCI6MTAzNTcsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NTYyNDQ0MTd9.zIAKracS9KnAN168xdPklxjDkmdJ1is3UZ0MfpEUcOY';
    eval(_mapMapper); //激活地图

    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(116.1949, 39.6345, 117.3949, 34.8345); //家
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.2949, 39.8345, 9000000.0) //转到指定
    });
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    show3DCoordinates();

    var options = [{
            text: '清理图层',
            onselect: function() {
                for (var i = viewer.imageryLayers.length; i > 0; i--) {
                    viewer.imageryLayers.remove(viewer.imageryLayers.get(i));
                }
            }
        },
        {
            text: '高德标注',
            onselect: function() {
                var road = new Cesium.UrlTemplateImageryProvider({
                    url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
                });
                viewer.imageryLayers.addImageryProvider(road);
            }
        },
        {
            text: '天地标注',
            onselect: function() {
                var tiandi = new Cesium.WebMapTileServiceImageryProvider({
                    url: "http://t2.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=cbadcd7ec0549b46c597e127199576d6",
                    layer: "tdtAnnoLayer",
                    style: "default",
                    format: "image/jpeg",
                    tileMatrixSetID: "GoogleMapsCompatible"
                });
                viewer.imageryLayers.addImageryProvider(tiandi);
            }
        }
    ];
    Sandcastle.addToolbarMenu(options);

    // newslist.ObjAbstract($("#Chart1"),1);
});

var Map = {
    'flytodst': function(itemid) {
        setLayout(0);
        $.ajax({
            url: 'http://47.240.13.42/xearth/earth-map/test',
            type: 'post',
            data: 'itemid=' + itemid,
            dataType: 'json',
            success: function(json) {
                // console.log(json);
                var defaultCamera = 9000000.0;

                switch (json.id) {
                    case '11':
                        defaultCamera = 900000.0;
                        break;
                    case '111':
                        defaultCamera = 900.0;
                        break;
                    case '112':
                        defaultCamera = 900.0;
                        break;
                    case '113':
                        defaultCamera = 900.0;
                        break;
                }

                var yihai = viewer.entities.add({
                    name: json['name'],
                    position: Cesium.Cartesian3.fromDegrees(json['longitude'], json['latitude']),
                    description: json['description'],
                    label: { //文字标签
                        text: json['name'],
                        font: '30px MicroSoft YaHei',
                        scale: 0.5,
                        fillColor: Cesium.Color.RED,
                        showBackground: true,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, //去掉地形遮挡
                        //backgroundColor : Cesium.Color.fromCssColorString('#000'),	//fromRandom({alpha : 1.0}),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
                        pixelOffset: new Cesium.Cartesian2(0, -32) //偏移量
                    },
                    billboard: {
                        image: '/image/catalog/point0' + json['id'] % 10 + '.png',
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, //去掉地形遮挡
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        scale: 0.5,
                    }
                });
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(json['longitude'], json['latitude'], defaultCamera) //转到指定9000000.0
                });

                // if (1) {
                //     viewer.camera.zoomIn(10000);
                // }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    //特殊：针对 APP接警记录
    'flytodst2': function(itemid, location_x, location_y, time, name) {
        setLayout(0);
        $.ajax({
            url: 'http://47.240.13.42/xearth/earth-map/test',
            type: 'post',
            data: 'itemid=' + itemid + '&location_x=' + location_x + '&location_y=' + location_y + '&time=' + time + '&name=' + name,
            dataType: 'json',
            success: function(json) {
                // console.log(json.id);
                var defaultCamera = 9000000.0;

                switch (itemid) {
                    case 11:
                        defaultCamera = 900000.0;
                        break;
                    case 111:
                        defaultCamera = 900.0;
                        break;
                    case 112:
                        defaultCamera = 900.0;
                        break;
                    case 113:
                        defaultCamera = 900.0;
                        break;
                    case 200:
                        defaultCamera = 9000.0;
                        break;
                    case 300:
                        defaultCamera = 9000.0;
                        break;
                }

                var yihai = viewer.entities.add({
                    name: json['name'],
                    position: Cesium.Cartesian3.fromDegrees(json['longitude'], json['latitude']),
                    description: json['description'],
                    label: { //文字标签
                        text: json['name'],
                        font: '30px MicroSoft YaHei',
                        scale: 0.5,
                        fillColor: Cesium.Color.RED,
                        showBackground: true,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, //去掉地形遮挡
                        //backgroundColor : Cesium.Color.fromCssColorString('#000'),	//fromRandom({alpha : 1.0}),
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
                        pixelOffset: new Cesium.Cartesian2(0, -32) //偏移量
                    },
                    billboard: {
                        image: '/image/catalog/point0' + json['id'] % 10 + '.png',
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, //去掉地形遮挡
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        scale: 0.5,
                    }
                });
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(json['longitude'], json['latitude'], defaultCamera) //转到指定9000000.0
                });

                // if (1) {
                //     viewer.camera.zoomIn(10000);
                // }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'flytodst3': function(json) {
        var defaultCamera = 9000000.0;
        switch (json.lev) {
            case "1":
                defaultCamera = 900000.0;
                break;
            case "2":
                defaultCamera = 90000.0;
                break;
            case "3":
                defaultCamera = 9000.0;
                break;
            case "4":
                defaultCamera = 900.0;
                break;
        }
        var yihai = viewer.entities.add({
            name: json['text'],
            position: Cesium.Cartesian3.fromDegrees(json['lng'], json['lat']),
            description: json['text'], // 暂时传入标题 现在没有描述
            label: { //文字标签
                text: json['text'],
                font: '30px MicroSoft YaHei',
                scale: 0.5,
                fillColor: Cesium.Color.RED,
                showBackground: true,
                disableDepthTestDistance: Number.POSITIVE_INFINITY, //去掉地形遮挡
                //backgroundColor : Cesium.Color.fromCssColorString('#000'),	//fromRandom({alpha : 1.0}),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
                pixelOffset: new Cesium.Cartesian2(0, -32) //偏移量
            },
            billboard: {
                image: '/image/catalog/point0' + json['id'] % 10 + '.png',
                disableDepthTestDistance: Number.POSITIVE_INFINITY, //去掉地形遮挡
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.5,
            }
        });
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(json['lng'], json['lat'], defaultCamera) //转到指定9000000.0
        });
    }
}

/*var leftmenu = {
	'update': function(parent_id,menutitle) {
		$.ajax({
			url: '/earth/leftmenu',
			type: 'post',
			data: 'parent_id=' + parent_id +"&menutitle=" + menutitle,
			dataType: 'html',
			success: function(data) {
				$('#leftmenu').html(data);
				$('.nav-link.collapsed').on('click', function() {   $(this).children('.pull-right.fa').toggleClass('fa-angle-right fa-angle-down');});
				console.log(data);
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
			}
		});
	},
};*/

var newslist = {
    /*'SwipeNews': function(days,perPage) {
        $.ajax({
            url: '/earth/newslist',
            type: 'post',
            data: 'publishdate=' + days +"&perPage="+perPage,
            dataType: 'html',
            success: function(data) {
                $("#MapViewer").html(data);
                var regExp=/<script[^>]*>([\s\S]*)<\/script>/i;
                if(regExp.test(data)){
                    eval(RegExp.$1);
//					console.log(RegExp.$1);
                }
            }
        });
    },*/
    /*'NewsAbstract': function(newsid) {
        $('#modal-doc').remove();
        $.ajax({
            url: '/earth/news',
            type: 'post',
            data: 'news_id=' + newsid+"&abstract=1" ,
            dataType: 'html',
            success: function(data) {
                html  = '<div id="modal-doc" class="modal">';
                html += '  <div class="modal-dialog" >';
                html += '    <div class="modal-content">';
                html += '      <div class="modal-header">';
                html += '       <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
                html += '      </div>';
                html += '      <div class="modal-body" >' + data + '</div>';
                html += '      <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button> </div>';
                html += '    </div>';
                html += '  </div>';
                html += '</div>';

                $('body').append(html);
                $('#modal-doc').modal('show');
                var regExp=/<script[^>]*>([\s\S]*)<\/script>/i;
                if(regExp.test(data)){
                    eval(RegExp.$1);
                }
            },
        });
    },*/
    /*'ObjAbstract': function(tabobj,newsid) {
        tabobj.css({ "height": "100%"});
        $.ajax({
            url: '/earth/news',
            type: 'post',
            data: 'news_id=' + newsid+"&abstract=1" ,
            dataType: 'html',
            success: function(data) {
                tabobj.html(data);
            },
        });
    },*/
    /*'NewsFile': function(newsid,title) {
        $('#modal-doc').remove();
        $.ajax({
            url: '/earth/news',
            type: 'post',
            data: 'news_id=' + newsid,
            dataType: 'html',
            success: function(data) {
                html  = '<div id="modal-doc" class="modal fade">';
                html += '  <div class="modal-dialog modal-lg" >';
                html += '    <div class="modal-content">';
                html += '      <div class="modal-header">';
                html += '        <h4 class="modal-title" align="center"> ' + title + '</h4>';
                html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
                html += '      </div>';
                html += '      <div class="modal-body" >' + data + '</div>';
                html += '      <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button> </div>';
                html += '    </div>';
                html += '  </div>';
                html += '</div>';

                $('body').append(html);
                $('#modal-doc').modal('show');
                var regExp=/<script[^>]*>([\s\S]*)<\/script>/i;
                if(regExp.test(data)){
                    console.log(RegExp.$1);
                    eval(RegExp.$1);
                }
            },
        });
    },*/
    'DisplayContent': function(title, content) {
        $('#modal-doc').remove();
        html = '<div id="modal-doc" class="modal fade">';
        html += '  <div class="modal-dialog" >';
        html += '    <div class="modal-content">';
        html += '      <div class="modal-header">';
        html += '        <h4 class="modal-title " align="center">' + title + '</h4>';
        html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
        html += '      </div>';
        html += '      <div class="modal-body" >' + content + '</div>';
        html += '      <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button> </div>';

        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        $('body').append(html);
        $('#modal-doc').modal('show');
    },

}

var loadLayer = function() {
    var providerViewModels = [];
    var bingMapModel = new Cesium.ProviderViewModel({
        name: 'Bing地图',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/bingAerial.png',
        tooltip: 'Bing地图服务 ',
        creationFunction: function() {
            return new Cesium.BingMapsImageryProvider({
                url: 'https://dev.virtualearth.net',
                key: 'AiasCD9Fx29JpVQYBhEv_SpFXjPGK_urgLzrcfdK5dy7Hoa1LEfHQEUwuXsP73AB',
                mapStyle: Cesium.BingMapsStyle.AERIAL
            });
        }
    });
    providerViewModels.push(bingMapModel);

    var esriMapModel = new Cesium.ProviderViewModel({
        name: 'ArcGIS',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/esriNationalGeographic.png',
        tooltip: 'ArcGIS 地图服务 ',
        creationFunction: function() {
            return new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',

            });
        }
    });
    providerViewModels.push(esriMapModel);

    var osmMapModel = new Cesium.ProviderViewModel({
        name: 'OpenStreet',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/openStreetMap.png',
        tooltip: 'OpenStreetMap 地图服务 ',
        creationFunction: function() {
            return new Cesium.createOpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            });
        }
    });
    providerViewModels.push(osmMapModel);

    var mbox1MapModel = new Cesium.ProviderViewModel({
        name: 'MapBox街',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/mapboxStreets.png',
        tooltip: 'MapBox街区地图',
        creationFunction: function() {
            return new Cesium.MapboxImageryProvider({
                mapId: 'mapbox.streets',
                accessToken: 'sk.eyJ1IjoibGVibGl1IiwiYSI6ImNqc2ptaXd1eTB0aXY0YXRiMXpxYnV5dGQifQ.1iFUUuHIT07d0zp_pZ8K1Q'
            });
        }
    });
    providerViewModels.push(mbox1MapModel);

    var mbox2MapModel = new Cesium.ProviderViewModel({
        name: 'MapBox星',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/mapboxSatellite.png',
        tooltip: 'MapBox卫星地图',
        creationFunction: function() {
            return new Cesium.MapboxImageryProvider({
                mapId: 'mapbox.satellite',
                accessToken: 'sk.eyJ1IjoibGVibGl1IiwiYSI6ImNqc2ptaXd1eTB0aXY0YXRiMXpxYnV5dGQifQ.1iFUUuHIT07d0zp_pZ8K1Q'
            });
        }
    });
    providerViewModels.push(mbox2MapModel);

    var tdtMapModel = new Cesium.ProviderViewModel({
        name: '天地矢量', //tdt Maps
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/tdt.jpg',
        tooltip: '天地矢量地图',
        creationFunction: function() {
            return new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t3.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=cbadcd7ec0549b46c597e127199576d6",
                layer: "tdtVecBasicLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            });
        }
    });
    providerViewModels.push(tdtMapModel);

    var tdtvMapModel = new Cesium.ProviderViewModel({
        name: '天地影像', //tdtv Maps
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/timg.jpg',
        tooltip: '天地影像地图',
        creationFunction: function() {
            return new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t3.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=cbadcd7ec0549b46c597e127199576d6",
                layer: "tdtBasicLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            });
        }
    });
    providerViewModels.push(tdtvMapModel);

    var googleMap = new Cesium.ProviderViewModel({
        name: '谷歌区划', //http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/google1.jpg',
        tooltip: '谷歌行政区划',
        creationFunction: function() {
            return new Cesium.UrlTemplateImageryProvider({
                url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0',
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            });
        }
    });
    providerViewModels.push(googleMap);
    var googleMap1 = new Cesium.ProviderViewModel({
        name: '谷歌影像',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/google.jpg',
        tooltip: '谷歌影像地图',
        creationFunction: function() {
            return new Cesium.UrlTemplateImageryProvider({
                url: 'http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G',
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            });
        }
    });

    providerViewModels.push(googleMap1);

    var gaodeMap = new Cesium.ProviderViewModel({
        name: '高德影像',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/gaode.jpeg',
        tooltip: '高德影像地图',
        creationFunction: function() {
            return new Cesium.UrlTemplateImageryProvider({
                url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            });
        }
    });
    providerViewModels.push(gaodeMap);
    var gaodeMap1 = new Cesium.ProviderViewModel({
        name: '高德街道',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/gaode.jpg',
        tooltip: '高德街道地图',
        creationFunction: function() {
            return new Cesium.UrlTemplateImageryProvider({
                url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible"
            });
        }
    });
    providerViewModels.push(gaodeMap1);

    var baiduMap = new Cesium.ProviderViewModel({
        name: '百度街道',
        iconUrl: '/static/Cesium/Widgets/Images/ImageryProviders/bingRoads.png',
        tooltip: '百度街道地图',
        creationFunction: function() {
            return new Cesium.createTileMapServiceImageryProvider({
                url: '/GlobalTMS/北京_瓦片：TMS',
                credit: '北京市'
            });
        }
    });
    providerViewModels.push(baiduMap);

    var terrainViewModels = [];
    var wgsTerrain = new Cesium.ProviderViewModel({
        name: 'ArcticDEM',
        tooltip: '自动生成高分辨率',
        iconUrl: '/static/Cesium/Widgets/Images/TerrainProviders/Artic.jpg',
        creationFunction: function() {
            return new Cesium.CesiumTerrainProvider({
                url: Cesium.IonResource.fromAssetId(3956),
            })
        }
    });
    terrainViewModels.push(wgsTerrain);
    var arcTerrain = new Cesium.ProviderViewModel({
        name: 'PAMap',
        tooltip: '宾州高清淅度地形',
        iconUrl: '/static/Cesium/Widgets/Images/TerrainProviders/Pamap.jpeg',
        creationFunction: function() {
            return new Cesium.CesiumTerrainProvider({
                url: Cesium.IonResource.fromAssetId(3957),
            })
        }
    });
    terrainViewModels.push(arcTerrain);

    var stkTerrain = new Cesium.ProviderViewModel({
        name: '世界地形',
        tooltip: 'Cesium World Terrain',
        iconUrl: '/static/Cesium/Widgets/Images/TerrainProviders/CesiumWorldTerrain.png',
        creationFunction: function() {
            return new Cesium.CesiumTerrainProvider({
                url: Cesium.IonResource.fromAssetId(1),
                requestWaterMask: !0,
                requestVertexNormals: !0
            })
        }
    });
    terrainViewModels.push(stkTerrain);
    viewer.baseLayerPicker.viewModel.imageryProviderViewModels = providerViewModels; //imageryProviderViewModels[12]:
    viewer.baseLayerPicker.viewModel.terrainProviderViewModels = terrainViewModels; //0:地形 1:地形加标注 2:区划+标注 3:地貌 4:省市 5:中文省市 6：缺省 7：类2  8：语言标注 9：中文
};
//指定图标的配置和数据
var itemnum = {
    'bar': function(tabobj) {
        setLayout(0);
        tabobj.css({ "height": "34%" });
        var barchart = echarts.init(tabobj[0]);
        $.ajax({
            url: '/earth/statistic',
            type: 'post',
            data: 'tableid=1',
            dataType: 'json',
            success: function(json) {
                var xdata = Array();
                var data1 = Array();
                var data2 = Array();
                for (var i = 0; i < json.length; i++) {
                    xdata.push(json[i].disname.substring(0, json[i].disname.indexOf('区域')));
                    data1.push(json[i].gj);
                    data2.push(json[i].notgj);
                }
                var option = {
                    backgroundColor: 'rgba(0,0,0,70)',
                    title: {
                        text: '在建项目统计图',
                        x: 'center',
                        y: 'bottom',
                    },
                    tooltip: {},
                    legend: {
                        data: ['国际', '非国际']
                    },
                    xAxis: {
                        data: xdata
                    },
                    yAxis: {

                    },
                    series: [{
                            name: '国际',
                            stack: 'sum',
                            type: 'bar',
                            data: data1
                        },
                        {
                            name: '非国际',
                            stack: 'sum',
                            type: 'bar',
                            data: data2
                        },
                    ]
                };
                barchart.setOption(option);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'pie': function(tabobj) {
        tabobj.css({ "height": "34%" });
        var piechart = echarts.init(tabobj[0]);
        $.ajax({
            url: '/earth/statistic',
            type: 'post',
            data: 'tableid=1',
            dataType: 'json',
            success: function(json) {
                var xdata = Array();
                for (var i = 0; i < json.length; i++) {
                    xdata.push({ name: json[i].disname.substring(0, json[i].disname.indexOf('区域')), value: parseInt(json[i].gj) + parseInt(json[i].notgj) });
                }
                // console.log(xdata);
                var option = {
                    backgroundColor: 'rgba(0,0,0,70)',
                    title: {
                        text: '区域项目统计',
                        x: 'center',
                        y: 'bottom',
                    },
                    tooltip: {},
                    series: [{
                        type: 'pie',
                        data: xdata
                    }]
                };
                piechart.setOption(option);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'table': function(tabobj) {
        tabobj.css({ "height": "32%" });
        $.ajax({
            url: '/earth/statistic',
            type: 'post',
            data: 'tableid=' + 0,
            dataType: 'html',
            success: function(data) {
                tabobj.html(data)
            },
        });
    },
};

var curLayout = 0;
var setLayout = function(layout) {
    if (curLayout == layout) return;
    curLayout = layout;
    switch (layout) {
        case 0:
            $("#MapViewer").css({ "height": "100%" });
            $("#MapViewer").html("");
            $("#FileContent").hide();
            $("#toolbar").show();

            eval(_mapMapper);
            break;
        case 1:
            $("#MapViewer").css({ "height": "50%", "overflow-y": "auto" });
            $("#FileContent").css({ "height": "50%" });

            $("#toolbar").hide();
            $("#MapViewer").show();
            $("#FileContent").show();
            /*newslist.SwipeNews(-5,3);
            newslist.ObjAbstract($("#Chart1"),1);*/
            break;
        default:
    }
};
/*显示当前坐标*/
var show3DCoordinates = function() {
    let mapDivId;
    //地图底部工具栏显示地图坐标信息
    var elementbottom = document.createElement("div");
    $("#MapViewer").append(elementbottom);
    elementbottom.className = "mapfootBottom";
    var coordinatesDiv = document.getElementById(mapDivId + "_coordinates");
    if (coordinatesDiv) {
        coordinatesDiv.style.display = "block";
    } else {
        var _divID_coordinates = mapDivId + "_coordinates";
        coordinatesDiv = document.createElement("div");
        coordinatesDiv.id = _divID_coordinates;
        coordinatesDiv.className = "map3D-coordinates";
        coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>暂无坐标信息</span>";
        //document.getElementById(this.mapDivId).appendChild(coordinatesDiv);
        $("#MapViewer").append(coordinatesDiv);
        var handler3D = new Cesium.ScreenSpaceEventHandler(
            viewer.scene.canvas);
        handler3D.setInputAction(function(movement) {
            var pick = new Cesium.Cartesian2(movement.endPosition.x, movement.endPosition.y);
            if (pick) {
                var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick), viewer.scene);
                if (cartesian) {
                    //世界坐标转地理坐标（弧度）
                    var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                    if (cartographic) {
                        //海拔
                        var height = viewer.scene.globe.getHeight(cartographic);
                        //视角海拔高度
                        var he = Math.sqrt(viewer.scene.camera.positionWC.x * viewer.scene.camera.positionWC.x + viewer.scene.camera.positionWC.y * viewer.scene.camera.positionWC.y + viewer.scene.camera.positionWC.z * viewer.scene.camera.positionWC.z);
                        var he2 = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z);
                        //地理坐标（弧度）转经纬度坐标
                        var point = [cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180];
                        if (!height) {
                            height = 0;
                        }
                        if (!he) {
                            he = 0;
                        }
                        if (!he2) {
                            he2 = 0;
                        }
                        if (!point) {
                            point = [0, 0];
                        }
                        coordinatesDiv.innerHTML = "<span id='cd_label' style='font-size:13px;text-align:center;font-family:微软雅黑;color:#edffff;'>" + "视角海拔高度:" + (he - he2).toFixed(2) + "米" + "&nbsp;&nbsp;&nbsp;&nbsp;海拔:" + height.toFixed(2) + "米" + "&nbsp;&nbsp;&nbsp;&nbsp;经度：" + point[0].toFixed(6) + "&nbsp;&nbsp;纬度：" + point[1].toFixed(6) + "</span>";
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}



/*显示多个坐标 e 周边‘应急资源’坐标：*/
var showAroundResourceForEarth = function(name, longitude, latitude, telephone, img, description) {
    viewer.entities.add({
        name: name,
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        description: description,
        label: { //文字标签
            text: name + "\n\r" + telephone,
            font: '30px MicroSoft YaHei',
            scale: 0.5,
            fillColor: Cesium.Color.RED,
            showBackground: true,
            disableDepthTestDistance: Number.POSITIVE_INFINITY, //去掉地形遮挡
            //backgroundColor : Cesium.Color.fromCssColorString('#000'),	//fromRandom({alpha : 1.0}),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
            pixelOffset: new Cesium.Cartesian2(0, -32) //偏移量
        },
        billboard: {
            image: img,
            disableDepthTestDistance: Number.POSITIVE_INFINITY, //去掉地形遮挡
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            scale: 0.5,
        }

    });

    // viewer.entities.removeById(该实体ID)
    // viewer.entities.removeNamedItem()
}