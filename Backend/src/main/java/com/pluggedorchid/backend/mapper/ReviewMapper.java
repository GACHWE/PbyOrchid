//package com.pluggedorchid.backend.mapper;
//
//import com.pluggedorchid.backend.dto.ReviewRequest;
//import com.pluggedorchid.backend.dto.ReviewResponse;
//import com.pluggedorchid.backend.entity.Review;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;
//
//@Mapper(componentModel = "spring")
//public interface ReviewMapper {
//
//    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);
//
//    Review toEntity(ReviewRequest request);
//
//    @Mapping(source = "user.id", target = "userId")
//    @Mapping(source = "user.firstName", target = "userFirstName")
//    @Mapping(source = "sneaker.id", target = "sneakerId")
//    ReviewResponse toResponse(Review review);
//}