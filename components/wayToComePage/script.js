(function () {
    const name = 'wayToComePage';

    Vue.component(name, function (resolve, reject) {
        $.get('components/' + name + '/index.html').done(function (tmpl) {
            resolve({
                template: tmpl,
                data: function () {
                    return {
                        name: 'wayToCome'
                    }
                },
                methods: {
					getMap: function(){
						let t = this;
						var mapContainer = document.getElementById('wayToComePage_map'), // 지도를 표시할 div 
							mapOption = { 
								center: new kakao.maps.LatLng(37.59927799253281, 126.92403314233718), // 지도의 중심좌표
								level: 2 // 지도의 확대 레벨
							};

						var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

						// 지도를 클릭한 위치에 표출할 마커입니다
						var marker = new kakao.maps.Marker({ 
							// 지도 중심좌표에 마커를 생성합니다 
							position: map.getCenter() 
						}); 
						// 지도에 마커를 표시합니다
						marker.setMap(map);
						
						return;

						// 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다.
						let href = 'https://map.kakao.com/link/to/그루터기도서관,37.59927799253281,126.92403314233718';
						var iwContent = '<div style="padding:5px; width:125px;">' +
							'<a href="' + href + '" target="_blank">길찾기</a>' +
							'</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
							iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

						// 인포윈도우를 생성합니다
						var infowindow = new kakao.maps.InfoWindow({
							content : iwContent,
							removable : iwRemoveable
						});

						// 마커에 클릭이벤트를 등록합니다
						kakao.maps.event.addListener(marker, 'click', function() {
							// 마커 위에 인포윈도우를 표시합니다
							infowindow.open(map, marker);  
						});
						
						
					}
					
                },
                created: function () {
                    var t = this;
                },
				mounted: function(){
					let t = this;
					t.getMap();
					
				}
            });
        });
    });
})();